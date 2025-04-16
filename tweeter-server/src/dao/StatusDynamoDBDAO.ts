import {
	BatchGetCommand,
	DynamoDBDocumentClient,
	PutCommand,
	QueryCommand,
	BatchWriteCommand
} from "@aws-sdk/lib-dynamodb";
import {
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { FollowerEntity, PostEntity, StatusDto, UserDto } from "tweeter-shared";
import { StatusDAO } from "./interfaces/StatusDAO";
import { FollowDynamoDBDAO } from "./FollowDynamoDBDAO";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export class StatusDynamoDBDAO implements StatusDAO {
	tableName: string;
	readonly user_handle_attr = "owner_handle";
	readonly status_attr = "post";
	readonly timestamp_attr = "timestamp";

	readonly user_alias_attr = "user_handle";
	readonly user_firstName_attr = "user_firstName";
	readonly user_lastName_attr = "user_lastName";
	readonly user_imageUrl_attr = "user_imageUrl";
	readonly user_password_attr = "user_password";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
	private readonly sqs = new SQSClient({ region: "us-east-2" });
	private readonly postStatusQueueUrl = "https://sqs.us-east-2.amazonaws.com/664418969627/PostStatusQ";

	constructor(tableName: string) {
		this.tableName = tableName;
	}

	async loadMoreItems(
		userAlias: string,
		pageSize: number,
		lastItem: StatusDto | undefined,
		statusType: string
	): Promise<[StatusDto[], boolean]> {
		const params = {
			KeyConditionExpression: this.user_handle_attr + " = :uh",
			ExpressionAttributeValues: {
				":uh": userAlias,
			},
			TableName: this.tableName,
			Limit: pageSize,
			ExclusiveStartKey:
				!lastItem
				? undefined
				: {
					[this.user_handle_attr]: lastItem.user.alias,
					[this.timestamp_attr]: lastItem.timestamp
				},
		};


		const data = await this.client.send(new QueryCommand(params));
		console.log("STATUS POST DATA:::: ", data);

		const items: PostEntity[] = [];
		const itemsMap = new Map<string, PostEntity[]>();
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		data.Items?.forEach((item: any) => {
			console.log(item);
			const entity = new PostEntity(
				item[this.status_attr],
				item[this.user_handle_attr],
				item[this.timestamp_attr],
			);
			items.push(entity);
			if (itemsMap.has(item[this.user_handle_attr])) {
				itemsMap.get(item[this.user_handle_attr])!.push(entity);
			}
			else {
				itemsMap.set(item[this.user_handle_attr], [entity]);
			}
		});

		console.log("STATUS ITEMS AFTER QUERY::: ", items);
		console.log("STATUS ITEM MAP::: ", itemsMap);

		if (items.length != 0) {

			const keySet = new Set();
			const keys: any = [];
			items.forEach((item) => {
				if (!keySet.has(item.userAlias)) {
					keySet.add(item.userAlias);
					keys.push({
						[this.user_alias_attr]: item.userAlias
					})
				}
			});

			console.log("DUP FREE KEYS:::: ", keys);
			const params = {
				RequestItems: {
					['users']: {
						Keys: keys
					}
				}
			};

			const result = await this.client.send(new BatchGetCommand(params));
			console.log("STATUS AFTER BATCH GET:::: ", result.Responses);
			if (result.Responses) {
				const postList: StatusDto[] = []
				result.Responses['users'].forEach((item) => {
					let nextPost = itemsMap.get(item[this.user_alias_attr])?.pop();
					console.log("POST:::: ", nextPost);
					while (nextPost) {
						postList.push({
							post: nextPost.post.post,
							user: {
								firstName: nextPost.post.user.firstName,
								lastName: nextPost.post.user.lastName,
								alias: nextPost.post.user.alias,
								imageUrl: nextPost.post.user.imageUrl
							},
							// user: {
							// 	firstName: item[this.user_firstName_attr],
							// 	lastName: item[this.user_lastName_attr],
							// 	alias: item[this.user_alias_attr],
							// 	imageUrl: item[this.user_imageUrl_attr]
							// },
							timestamp: nextPost.timestamp,
						})
						nextPost = itemsMap.get(item[this.user_alias_attr])?.pop();
					}
				});
				return [postList, hasMorePages]
				// return [result.Responses['users'].map<StatusDto>(
				// 	(item) => (
				// 		{
				// 			post: itemsMap.get(item[this.user_alias_attr])!.pop()?.post ?? "",
				// 			user: {
				// 				firstName: item[this.user_firstName_attr],
				// 				lastName: item[this.user_lastName_attr],
				// 				alias: item[this.user_alias_attr],
				// 				imageUrl: item[this.user_imageUrl_attr]
				// 			},
				// 			timestamp: itemsMap.get(item[this.user_alias_attr])!.pop()?.timestamp ?? -1,
				// 		}
				// 	)
				// ), hasMorePages]
			}
		}
		return [[], hasMorePages];
	}

	async putStatus(status: StatusDto): Promise<void> {
		// put post in story of user
		const storyParams = {
			TableName: 'story',
			Item: {
				[this.status_attr]: status,
				[this.user_handle_attr]: status.user.alias,
				[this.timestamp_attr]: status.timestamp,
			},
		};
		await this.client.send(new PutCommand(storyParams));
		// query all followers and add to feed (batchget)
		// const followerParams = {
		// 	KeyConditionExpression: 'followee_handle' + " = :feh",
		// 	ExpressionAttributeValues: {
		// 		":feh": status.user.alias,
		// 	},
		// 	TableName: 'follows',
		// 	IndexName: 'follows_index',
		// 	// include exclusivestartkey?
		// }
		// const followers = await this.client.send(new QueryCommand(followerParams));
		// followers.Items?.forEach(async (item) => {
		// 	const feedParams = {
		// 		TableName: 'feed',
		// 		Item: {
		// 			[this.status_attr]: status,
		// 			[this.user_handle_attr]: item['follower_handle'], // TODO:
		// 			[this.timestamp_attr]: status.timestamp,
		// 		},
		// 	};
		// 	await this.client.send(new PutCommand(feedParams));
		// });

		// Do I need to do this for each follower?
		const message = {
			[this.status_attr]: status,
			[this.user_handle_attr]: status.user.alias,
			[this.timestamp_attr]: status.timestamp
		};

		await this.sqs.send(new SendMessageCommand({
			DelaySeconds: 0,
			MessageBody: JSON.stringify(message),
			QueueUrl: this.postStatusQueueUrl
		}))
	}
	async batchFeedUpdate(followers: UserDto[], status: StatusDto): Promise<void> {
		const batchSize = 25;
		const writeRequests = followers.map((item: any) => ({
			PutRequest: {
				Item: {
					[this.status_attr]: status,
					[this.user_handle_attr]: item['alias'],
					[this.timestamp_attr]: status.timestamp,
				},
			},
		}));

		for (let i = 0; i < writeRequests.length; i += batchSize) {
			const startTimeMillis = new Date().getTime();
			const batch = writeRequests.slice(i, i + batchSize);
			await this.client.send(new BatchWriteCommand({
				RequestItems: {
					[this.tableName]: batch
				}
			}));
			const elapsedTime = new Date().getTime() - startTimeMillis;
			if (elapsedTime < 1000) {
				await new Promise<void>((resolve) => setTimeout(resolve, 1000 - elapsedTime));
			}
		}
	}
}