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
	readonly user_alias_attr = "user";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	async getAliasFromToken(token: string): Promise<string | undefined> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.authToken_attr]: token
			}
		};
		const output = await this.client.send(new GetCommand(params));
		return output.Item ? output.Item[this.user_alias_attr] : undefined
	}

	async putToken(authToken: AuthTokenDto, alias: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.authToken_attr]: authToken.token,
				[this.timestamp_attr]: authToken.timestamp,
				[this.user_alias_attr]: alias
			},
		};
		await this.client.send(new PutCommand(params));
	}
	async checkToken(token: string): Promise<boolean> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.authToken_attr]: token ?? ""
			}
		};
		console.log("TOKEN CHECK BEFORE:::: ", params);
		const output = await this.client.send(new GetCommand(params));
		console.log("TOKEN CHECK AFTER:::: ", output);
		return output.Item == undefined || output.Item[this.authToken_attr] == undefined
			? false
			: Date.now() - output.Item[this.timestamp_attr] < 900000 // check to see if token is timed out
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