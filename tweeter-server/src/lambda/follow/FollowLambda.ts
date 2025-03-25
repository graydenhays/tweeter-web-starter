import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService"

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
	const followService = new FollowService();
	const [followerCount, followeeCount] = await followService.follow(
		request.token!,
		request.user
	);

	return {
		success: true,
		message: undefined,
		followCount: followerCount,
		followCount2: followeeCount
	}
}