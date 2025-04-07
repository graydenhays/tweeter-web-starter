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
// import { FollowEntity } from "tweeter-shared/src/model/dto/entity/FollowEntity";
import { FollowDAO } from "./interfaces/FollowDAO";
import { UserDto } from "tweeter-shared";
// import { DataPage } from "tweeter-shared/src/model/dto/entity/DataPage";
import { FollowerEntity } from "tweeter-shared";

export class FollowDynamoDBDAO implements FollowDAO {
	readonly tableName = "follows";
	readonly indexName = "follows_index";
	readonly follower_handle_attr = "follower_handle";
	// readonly follower_firstName_attr = "follower_firstName";
	// readonly follower_lastName_attr = "follower_lastName";
	// readonly follower_imageUrl_attr = "follower_imageUrl";
	readonly followee_handle_attr = "followee_handle";
	// readonly followee_firstName_attr = "followee_firstName";
	// readonly followee_lastName_attr = "followee_lastName";
	// readonly followee_imageUrl_attr = "followee_imageUrl";
	readonly follower_count_attr = "follower_count";
	readonly followee_count_attr = "followee_count";
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

	// async putFollow(follower: FollowEntity): Promise<void> {
	//   const params = {
	// 	TableName: this.tableName,
	// 	Item: {
	// 	  [this.follower_handle_attr]: follower.follower_handle,
	// 	//   [this.follower_firstName_attr]: follower.follower_firstName,
	// 	//   [this.follower_lastName_attr]: follower.follower_lastName,
	// 	//   [this.follower_imageUrl_attr]: follower.follower_imageUrl,
	// 	  [this.followee_handle_attr]: follower.followee_handle,
	// 	//   [this.followee_firstName_attr]: follower.followee_firstName,
	// 	//   [this.followee_lastName_attr]: follower.followee_lastName,
	// 	//   [this.followee_imageUrl_attr]: follower.followee_imageUrl,
	// 	  [this.follower_count_attr]: follower.follower_count,
	// 	  [this.followee_count_attr]: follower.followee_count
	// 	},
	//   };
	//   await this.client.send(new PutCommand(params));
	// }

	// async updateFollow(follower: FollowEntity): Promise<void> {
	//   const params = {
	// 	TableName: this.tableName,
	// 	Key: this.generateFollowItem(follower),
	// 	ExpressionAttributeValues: {
	// 		":newFollowerFirstName": follower.follower_firstName,
	// 		":newFollowerLastName": follower.follower_lastName,
	// 		":newFolloweeFirstName": follower.followee_firstName,
	// 		":newFolloweeLastName": follower.followee_lastName,
	// 	},
	// 	UpdateExpression:
	// 	  "SET " + this.follower_firstName_attr + " = :newFollowerFirstName, "
	// 	  + this.follower_lastName_attr + " = :newFollowerLastName, "
	// 	  + this.followee_firstName_attr + " = :newFolloweeFirstName, "
	// 	  + this.followee_lastName_attr + " = :newFolloweeLastName",
	//   };
	//   await this.client.send(new UpdateCommand(params));
	// }

	async updateFollower(follower: FollowerEntity): Promise<void> {
		const params = {
		  TableName: this.tableName,
		  Key: this.generateFollowerItem(follower),
		  ExpressionAttributeValues: {
			  ":newFollowerName": follower.follower_name,
			  ":newFolloweeName": follower.followee_name
		  },
		  UpdateExpression:
			"SET " + this.follower_name_attr + " = :newFollowerName, "
			+ this.followee_name_attr + " = :newFolloweeName",
		};
		await this.client.send(new UpdateCommand(params));
	}

	// async getFollow(follower: FollowEntity): Promise<FollowEntity | undefined> {
	//   const params = {
	// 	TableName: this.tableName,
	// 	Key: this.generateFollowItem(follower),
	//   };
	//   const output = await this.client.send(new GetCommand(params));
	//   return output.Item == undefined
	// 	? undefined
	// 	: new FollowEntity(
	// 		output.Item[this.follower_handle_attr],
	// 		output.Item[this.follower_firstName_attr],
	// 		output.Item[this.follower_lastName_attr],
	// 		output.Item[this.follower_imageUrl_attr],
	// 		output.Item[this.followee_handle_attr],
	// 		output.Item[this.followee_firstName_attr],
	// 		output.Item[this.followee_lastName_attr],
	// 		output.Item[this.followee_imageUrl_attr],
	// 		output.Item[this.follower_count_attr],
	// 		output.Item[this.followee_count_attr]
	// 	);
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

	// async deleteFollow(follower: FollowEntity): Promise<void> {
	//   const params = {
	// 	TableName: this.tableName,
	// 	Key: this.generateFollowItem(follower),
	//   };
	//   await this.client.send(new DeleteCommand(params));
	// }

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
				[this.follower_handle_attr]: item[this.follower_handle_attr],
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
				return [result.Responses[this.tableName].map<UserDto>(
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

		// return new DataPage<FollowerEntity>(items, hasMorePages);
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


			// let items: UserDto[] | null = [];

			if (items.length != 0) {
				const keys = items.map<Record<string, {}>>((item) => ({
					[this.followee_handle_attr]: item[this.followee_handle_attr],
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
					return [result.Responses[this.tableName].map<UserDto>(
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
		//   return new DataPage<FollowerEntity>(items, hasMorePages);
	}

	// async getPageOfFollowees(
	// 	followerHandle: string,
	// 	pageSize: number,
	// 	lastFolloweeHandle: string | undefined
	// ): Promise<[UserDto[], boolean]> {
	// 	const key = [{
	// 		[this.follower_handle_attr]: followerHandle
	// 	}]
	// 	const params = {
	// 	  RequestItems: {
	// 		[this.tableName]: {
	// 			Keys: key
	// 		}
	// 	  }
	// 	};

	// 	const data = await this.client.send(new BatchGetCommand(params));
	// 	if (data.Responses) {
	// 		return [data.Responses[this.tableName].map<UserDto>(
	// 			(item): UserDto => {
	// 				return {
	// 				firstName: item[this.followee_firstName_attr],
	// 				lastName: item[this.followee_lastName_attr],
	// 				alias: item[this.followee_handle_attr],
	// 				imageUrl: item[this.followee_imageUrl_attr]
	// 			}}
	// 		), false]
	// 	}
	// 	return [[], false]
	// }

	// async getPageOfFollowees(
	// 	followerHandle: string,
	// 	pageSize: number,
	// 	lastFolloweeHandle: string | undefined
	// ): Promise<[UserDto[], boolean]> {
	// 	const params = {
	// 	  KeyConditionExpression: this.follower_handle_attr + " = :frh",
	// 	  ExpressionAttributeValues: {
	// 		":frh": followerHandle,
	// 	  },
	// 	  TableName: this.tableName,
	// 	  IndexName: this.indexName,
	// 	  Limit: pageSize,
	// 	  ExclusiveStartKey:
	// 		lastFolloweeHandle === undefined
	// 		  ? undefined
	// 		  : {
	// 			  [this.followee_handle_attr]: lastFolloweeHandle,
	// 			  [this.follower_handle_attr]: followerHandle,
	// 			},
	// 	};

	// 	const items: UserDto[] = [];
	// 	const data = await this.client.send(new QueryCommand(params));
	// 	const hasMorePages = data.LastEvaluatedKey !== undefined;
	// 	data.Items?.forEach((item) =>
	// 	  items.push(
	// 		{
	// 			firstName: item[this.followee_firstName_attr],
	// 			lastName: item[this.followee_lastName_attr],
	// 			alias: item[this.followee_handle_attr],
	// 			imageUrl: item[this.followee_imageUrl_attr]
	// 		}
	// 	  )
	// 	);
	// 	return [items, hasMorePages]
	// }

	// async getPageOfFollowers(
	// 	followeeHandle: string,
	// 	pageSize: number,
	// 	lastFollowerHandle: string | undefined
	// ): Promise<[UserDto[], boolean]> {
	// 	const params = {
	// 		KeyConditionExpression: this.followee_handle_attr + " = :feh",
	// 		ExpressionAttributeValues: {
	// 		  ":feh": followeeHandle,
	// 		},
	// 		TableName: this.tableName,
	// 		IndexName: this.indexName,
	// 		Limit: pageSize,
	// 		ExclusiveStartKey:
	// 		  lastFollowerHandle === undefined
	// 			? undefined
	// 			: {
	// 				[this.followee_handle_attr]: followeeHandle,
	// 				[this.follower_handle_attr]: lastFollowerHandle,
	// 			  },
	// 	};

	// 	const items: UserDto[] = [];
	// 	const data = await this.client.send(new QueryCommand(params));
	// 	const hasMorePages = data.LastEvaluatedKey !== undefined;
	// 	data.Items?.forEach((item) =>
	// 		items.push(
	// 			{
	// 				firstName: item[this.followee_firstName_attr],
	// 				lastName: item[this.followee_lastName_attr],
	// 				alias: item[this.followee_handle_attr],
	// 				imageUrl: item[this.followee_imageUrl_attr]
	// 			}
	// 		)
	// 	);
	// 	return [items, hasMorePages];
	// }

	async getFollowersCount(followeeHandle: string): Promise<number> {
		let count = 0;
		let lastEvaluatedKey: Record<string, any> | undefined;

		do {
		  const params = {
			TableName: this.tableName,
			IndexName: this.indexName,
			KeyConditionExpression: `${this.followee_handle_attr} = :feh`,
			ExpressionAttributeValues: {
			  ":feh": followeeHandle
			},
			Select: 'COUNT' as const,
			ExclusiveStartKey: lastEvaluatedKey
		  };

		  const data = await this.client.send(new QueryCommand(params));
		  count += data.Count || 0;
		  lastEvaluatedKey = data.LastEvaluatedKey;
		} while (lastEvaluatedKey);

		return count;
	}

	async getFolloweesCount(followerHandle: string): Promise<number> {
		let count = 0;
		let lastEvaluatedKey: Record<string, any> | undefined;

		do {
		  const params = {
			TableName: this.tableName,
			IndexName: this.indexName,
			KeyConditionExpression: `${this.follower_handle_attr} = :frh`,
			ExpressionAttributeValues: {
			  ":frh": followerHandle
			},
			Select: 'COUNT' as const,
			ExclusiveStartKey: lastEvaluatedKey
		  };

		  const data = await this.client.send(new QueryCommand(params));
		  count += data.Count || 0;
		  lastEvaluatedKey = data.LastEvaluatedKey;
		} while (lastEvaluatedKey);

		return count;
	}

	// generateFollowItem(follower: FollowEntity) {
	//   return {
	// 	[this.follower_handle_attr]: follower.follower_handle,
	// 	[this.followee_handle_attr]: follower.followee_handle,
	//   };
	// }

	private generateFollowerItem(follower: FollowerEntity) {
		return {
		  [this.follower_handle_attr]: follower.follower_handle,
		  [this.followee_handle_attr]: follower.followee_handle,
		};
	}
}
