import {
	DynamoDBDocumentClient,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { PostDto, StatusDto } from "tweeter-shared";
import { StatusDAO } from "./interfaces/StatusDAO";

export class StatusDynamoDBDAO implements StatusDAO {
	tableName: string;
	readonly user_handle_attr = "owner_handle";
	readonly post_attr = "post";
	readonly timestamp_attr = "timestamp";
	readonly firstName_attr = "user_firstName";
	readonly lastName_attr = "user_lastName";
	readonly imageUrl_attr = "image_url";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	constructor(tableName: string) {
		this.tableName = tableName;
	}

	async loadMoreItems(
		userAlias: string,
		pageSize: number,
		lastItem: StatusDto | undefined | null
	): Promise<[PostDto[], boolean]> {
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

		const items: PostDto[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push(
				{
					userAlias: item[this.user_handle_attr],
					post: item[this.post_attr],
					timestamp: item[this.timestamp_attr],
					firstName: item[this.firstName_attr],
					lastName: item[this.lastName_attr],
					imageUrl: item[this.imageUrl_attr]
				}
			)
		);
		return [items, hasMorePages];
	}

	async putStatus(status: StatusDto): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.user_handle_attr]: status.user.alias,
				[this.post_attr]: status.post,
				[this.timestamp_attr]: status.timestamp,
				[this.firstName_attr]: status.user.firstName,
				[this.lastName_attr]: status.user.lastName,
				[this.imageUrl_attr]: status.user.imageUrl
			},
		};
		await this.client.send(new PutCommand(params));
	}
}