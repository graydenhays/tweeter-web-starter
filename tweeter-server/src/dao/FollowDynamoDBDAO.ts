import {
	BatchGetCommand,
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "./interfaces/FollowDAO";
import { UserDto } from "tweeter-shared";
import { FollowerEntity } from "tweeter-shared";

export class FollowDynamoDBDAO implements FollowDAO {
	readonly tableName = "follows";
	readonly indexName = "follows_index";
	readonly follower_handle_attr = "follower_handle";
	readonly followee_handle_attr = "followee_handle";

	readonly follower_name_attr = "follower_name";
	readonly followee_name_attr = "followee_name";

	readonly user_handle_attr = "user_handle";
	readonly user_firstName_attr = "user_firstName";
	readonly user_lastName_attr = "user_lastName";
	readonly user_imageUrl_attr = "user_imageUrl";
	readonly user_password_attr = "user_password";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	async putFollower(follower: FollowerEntity): Promise<void> {
		const params = {
		  TableName: this.tableName,
		  Item: {
			[this.follower_handle_attr]: follower.follower_handle,
			[this.follower_name_attr]: follower.follower_name,
			[this.followee_handle_attr]: follower.followee_handle,
			[this.followee_name_attr]: follower.followee_name,
		  },
		};
		await this.client.send(new PutCommand(params));
	}

	// async updateFollower(follower: FollowerEntity): Promise<void> {
	// 	const params = {
	// 	  TableName: this.tableName,
	// 	  Key: this.generateFollowerItem(follower),
	// 	  ExpressionAttributeValues: {
	// 		  ":newFollowerName": follower.follower_name,
	// 		  ":newFolloweeName": follower.followee_name
	// 	  },
	// 	  UpdateExpression:
	// 		"SET " + this.follower_name_attr + " = :newFollowerName, "
	// 		+ this.followee_name_attr + " = :newFolloweeName",
	// 	};
	// 	await this.client.send(new UpdateCommand(params));
	// }

	async getFollower(follower: FollowerEntity): Promise<FollowerEntity | undefined> {
		const params = {
		  TableName: this.tableName,
		  Key: this.generateFollowerItem(follower),
		};
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
		  ? undefined
		  : new FollowerEntity(
			  output.Item[this.follower_handle_attr],
			  output.Item[this.follower_name_attr],
			  output.Item[this.followee_handle_attr],
			  output.Item[this.followee_name_attr],
			);
	}

	async deleteFollower(follower: FollowerEntity): Promise<void> {
		const params = {
		  TableName: this.tableName,
		  Key: this.generateFollowerItem(follower),
		};
		await this.client.send(new DeleteCommand(params));
	}

	async getPageOfFollowees(
		followerHandle: string,
		pageSize: number,
		lastFolloweeHandle: string | undefined
	): Promise<[UserDto[], boolean]> {
		const params = {
		  KeyConditionExpression: this.follower_handle_attr + " = :frh",
		  ExpressionAttributeValues: {
			":frh": followerHandle,
		  },
		  TableName: this.tableName,
		  Limit: pageSize,
		  ExclusiveStartKey:
			lastFolloweeHandle === undefined
			  ? undefined
			  : {
				  [this.follower_handle_attr]: followerHandle,
				  [this.followee_handle_attr]: lastFolloweeHandle,
				},
		};

		const items: FollowerEntity[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
		  items.push(
			new FollowerEntity(
			  item[this.follower_handle_attr],
			  item[this.follower_name_attr],
			  item[this.followee_handle_attr],
			  item[this.followee_name_attr]
			)
		  )
		);

		if (items.length != 0) {
			const keys = items.map<Record<string, {}>>((item) => ({
				[this.user_handle_attr]: item[this.followee_handle_attr],
			}));

			const params = {
				RequestItems: {
					['users']: {
						Keys: keys,
					},
				},
			};

			const result = await this.client.send(new BatchGetCommand(params));

			if (result.Responses) {
				return [result.Responses['users'].map<UserDto>(
					(item) => ({
						firstName: item[this.user_firstName_attr],
						lastName: item[this.user_lastName_attr],
						alias: item[this.user_handle_attr],
						imageUrl: item[this.user_imageUrl_attr]
					})
				), hasMorePages];
			}
		}
		return [[], hasMorePages]
	}

	async getPageOfFollowers(
		followeeHandle: string,
		pageSize: number,
		lastFollowerHandle: string | undefined
	): Promise<[UserDto[], boolean]> {
		const params = {
			KeyConditionExpression: this.followee_handle_attr + " = :feh",
			ExpressionAttributeValues: {
			  ":feh": followeeHandle,
			},
			TableName: this.tableName,
			IndexName: this.indexName,
			Limit: pageSize,
			ExclusiveStartKey:
			  lastFollowerHandle === undefined
				? undefined
				: {
					[this.follower_handle_attr]: lastFollowerHandle,
					[this.followee_handle_attr]: followeeHandle,
				  },
		  };

		  const items: FollowerEntity[] = [];
		  const data = await this.client.send(new QueryCommand(params));
		  const hasMorePages = data.LastEvaluatedKey !== undefined;
		  data.Items?.forEach((item) =>
			items.push(
			  new FollowerEntity(
				item[this.follower_handle_attr],
				item[this.follower_name_attr],
				item[this.followee_handle_attr],
				item[this.followee_name_attr]
			  )
			)
		  );

			if (items.length != 0) {
				const keys = items.map<Record<string, {}>>((item) => ({
					[this.user_handle_attr]: item[this.follower_handle_attr],
				}));

				const params = {
					RequestItems: {
						['users']: {
							Keys: keys,
						},
					},
				};

				const result = await this.client.send(new BatchGetCommand(params));

				if (result.Responses) {
					return [result.Responses['users'].map<UserDto>(
						(item) =>({
							firstName: item[this.user_firstName_attr],
							lastName: item[this.user_lastName_attr],
							alias: item[this.user_handle_attr],
							imageUrl: item[this.user_imageUrl_attr]
						})
					), hasMorePages];
				}
			}
		return [[], hasMorePages]
	}

	async getFollowersCount(followeeHandle: string): Promise<number> {
		const params: any = {
			TableName: this.tableName,
			IndexName: this.indexName,
			KeyConditionExpression: `${this.followee_handle_attr} = :feh`,
			ExpressionAttributeValues: {
				":feh": followeeHandle
			},
			Select: 'COUNT'
		}

		const data = await this.client.send(new QueryCommand(params));

		return data.Count ?? 0

		// let count = 0;
		// let lastEvaluatedKey: Record<string, any> | undefined;

		// do {
		//   const params = {
		// 	TableName: this.tableName,
		// 	IndexName: this.indexName,
		// 	KeyConditionExpression: `${this.followee_handle_attr} = :feh`,
		// 	ExpressionAttributeValues: {
		// 	  ":feh": followeeHandle
		// 	},
		// 	Select: 'COUNT' as const,
		// 	ExclusiveStartKey: lastEvaluatedKey
		//   };

		//   const data = await this.client.send(new QueryCommand(params));
		//   count += data.Count || 0;
		//   lastEvaluatedKey = data.LastEvaluatedKey;
		// } while (lastEvaluatedKey);

		// return count;
	}

	async getFolloweesCount(followerHandle: string): Promise<number> {
		const params: any = {
			TableName: this.tableName,
			KeyConditionExpression: `${this.follower_handle_attr} = :feh`,
			ExpressionAttributeValues: {
				":feh": followerHandle
			},
			Select: 'COUNT'
		}

		const data = await this.client.send(new QueryCommand(params));

		return data.Count ?? 0

		// let count = 0;
		// let lastEvaluatedKey: Record<string, any> | undefined;

		// do {
		//   const params = {
		// 	TableName: this.tableName,
		// 	IndexName: this.indexName,
		// 	KeyConditionExpression: `${this.follower_handle_attr} = :frh`,
		// 	ExpressionAttributeValues: {
		// 	  ":frh": followerHandle
		// 	},
		// 	Select: 'COUNT' as const,
		// 	ExclusiveStartKey: lastEvaluatedKey
		//   };

		//   const data = await this.client.send(new QueryCommand(params));
		//   count += data.Count || 0;
		//   lastEvaluatedKey = data.LastEvaluatedKey;
		// } while (lastEvaluatedKey);

		// return count;
	}

	private generateFollowerItem(follower: FollowerEntity) {
		return {
		  [this.follower_handle_attr]: follower.follower_handle,
		  [this.followee_handle_attr]: follower.followee_handle,
		};
	}
}
