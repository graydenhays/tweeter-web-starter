import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (event: any) => {
	const followService = new FollowService();
	const sqs = new SQSClient({ region: "us-east-2" });
	const updateFeedQueueUrl = "https://sqs.us-east-2.amazonaws.com/664418969627/UpdateFeedQ";

  	for (const record of event.Records) {
		const output = JSON.parse(record.body);
		const status = output["post"];
		const userAlias = output["owner_handle"];
		const timestamp = output["timestamp"];

		let exclusiveStartKey = null;
		let followers = [];
		do {
			[followers, exclusiveStartKey] = await followService.loadMoreFollowers("", userAlias, 100, exclusiveStartKey); // is this too slow to return userdtos??
			console.log("FOLLOWERS::: ", followers);
			if (followers.length) {
				console.log("SENDING FOLLOWERS");
				await sqs.send(new SendMessageCommand({
					QueueUrl: updateFeedQueueUrl,
					MessageBody: JSON.stringify({
						followers: followers,
						status: status
					})
				}))
				// await sleep(100) --> promise set timeout ?????????????????
				exclusiveStartKey = followers[-1]
			}
			else {
				exclusiveStartKey = null;
			}
		} while (exclusiveStartKey);
    }
};
