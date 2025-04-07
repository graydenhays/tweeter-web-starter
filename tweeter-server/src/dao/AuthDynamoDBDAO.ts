import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import {
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { AuthDAO } from "./interfaces/AuthDAO";
import { AuthTokenDto, UserDto } from "tweeter-shared";

export class AuthDynamoDBDAO implements AuthDAO {
	readonly tableName = "sessions";
	readonly authToken_attr = "authToken";
	readonly timestamp_attr = "timestamp";
	readonly user_attr = "user";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	async putToken(authToken: AuthTokenDto, user: UserDto): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.authToken_attr]: authToken.token,
				[this.timestamp_attr]: authToken.timestamp,
				[this.user_attr]: user
			},
		};
		await this.client.send(new PutCommand(params));
	}
	async checkToken(token: string): Promise<[AuthTokenDto, UserDto] | undefined> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.authToken_attr]: token
			}
		};
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
		? undefined
		: [{
			token: output.Item[this.authToken_attr],
			timestamp: output.Item[this.timestamp_attr]
		}, output.Item[this.user_attr]]
	}
	async deleteToken(token: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.authToken_attr]: token
			}
		};
		await this.client.send(new DeleteCommand(params));
	}
}