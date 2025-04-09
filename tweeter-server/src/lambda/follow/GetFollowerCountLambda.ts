import { FollowRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService"

export const handler = async (request: FollowRequest): Promise<FollowCountResponse> => {
	const followService = new FollowService();
	const followerCount = await followService.getFollowerCount(
		request.token,
		request.user
	);

	return {
		success: true,
		message: undefined,
		followCount: followerCount
	}
}