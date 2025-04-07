import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
	DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import { UserDto } from "tweeter-shared";
import { UserDAO } from "./interfaces/UserDAO";

export class UserDynamoDBDAO implements UserDAO {
	readonly tableName = "users";
	readonly user_handle_attr = "user_handle";
	readonly user_firstName_attr = "user_firstName";
	readonly user_lastName_attr = "user_lastName";
	readonly user_imageUrl_attr = "user_imageUrl";
	readonly user_password_attr = "user_password";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	async putUser(user: UserDto, password: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.user_handle_attr]: user.alias,
				[this.user_firstName_attr]: user.firstName,
				[this.user_lastName_attr]: user.lastName,
				[this.user_imageUrl_attr]: user.imageUrl,
				[this.user_password_attr]: password,
			},
		};
		await this.client.send(new PutCommand(params));
	}
	async updateUser(user: UserDto): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.user_handle_attr]: user.alias
			},
			ExpressionAttributeValues: {
				":newUserFirstName": user.firstName,
				":newUserLastName": user.lastName
			},
			UpdateExpression:
			  "SET " + this.user_firstName_attr + " = :newUserFirstName, "
			  + this.user_lastName_attr + " = :newUserLastName"
		};
		await this.client.send(new UpdateCommand(params));
	}
	async getUser(userAlias: string): Promise<[UserDto, string] | undefined> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.user_handle_attr]: userAlias
			}
		};
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
		? undefined
		: [{
			alias: output.Item[this.user_handle_attr],
			firstName: output.Item[this.user_firstName_attr],
			lastName: output.Item[this.user_lastName_attr],
			imageUrl: output.Item[this.user_imageUrl_attr],
		}, output.Item[this.user_password_attr]]
	}
	async deleteUser(user: UserDto): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.user_handle_attr]: user.alias
			}
		};
		await this.client.send(new DeleteCommand(params));
	}
}