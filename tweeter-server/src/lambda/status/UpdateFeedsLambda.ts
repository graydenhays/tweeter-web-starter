import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (event: any) => {
	const statusService = new StatusService();
	for (const record of event.Records) {

		console.log("RECORD::: ", record);
		console.log("RECORD BODY::: ", record.body);

		const startTimeMillis = new Date().getTime();

		const output = JSON.parse(record.body);
		const followers = output["followers"]
		const status = output["status"]
		console.log("followers::: ", followers);
		console.log("status::: ", status);

		await statusService.batchFeedUpdate(followers, status);

		const elapsedTime = new Date().getTime() - startTimeMillis;
		if (elapsedTime < 1000) {
			await new Promise<void>((resolve) => setTimeout(resolve, 1000 - elapsedTime));
		}

		// const batchSize = 25; // DynamoDB's maximum batch size
		// const writeRequests = followers.Items.map((item: any) => ({
		// 	PutRequest: {
		// 		Item: {
		// 			[status_attr]: status,
		// 			[user_handle_attr]: item['follower_handle'],
		// 			[timestamp_attr]: status.timestamp,
		// 		},
		// 	},
		// }));

		// for (let i = 0; i < writeRequests.length; i += batchSize) {
		// 	const batch = writeRequests.slice(i, i + batchSize);

		// 	await this.client.send(new BatchWriteItemCommand({
		// 		RequestItems: {
		// 			'feed': batch
		// 		}
		// 	}));
		// }



		// followers.Items.forEach(async (item: any) => {
		// 	const feedParams = {
		// 		TableName: 'feed',
		// 		Item: {
		// 			[status_attr]: status,
		// 			[user_handle_attr]: item['follower_handle'], // TODO:
		// 			[timestamp_attr]: status.timestamp,
		// 		},
		// 	};
		// 	await this.client.send(new PutCommand(feedParams));
		// });



		// const writeRequests = followers.map(follower => ({
		// 	PutRequest: {
		// 		Item: marshall({
		// 		owner_handle: follower,
		// 		post: status,
		// 		timestamp: timestamp
		// 		})
		// 	}
		// }));

		// // Process in batches of 25 (DynamoDB limit)
		// for (let i = 0; i < writeRequests.length; i += 25) {
		// const batch = writeRequests.slice(i, i + 25);

		// await dynamo.send(new BatchWriteItemCommand({
		// 	RequestItems: {
		// 	"feed": batch
		// 	}
		// }));
		// }
	}
};
