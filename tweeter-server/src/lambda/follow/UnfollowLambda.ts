import { FollowRequest, FollowResponse, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService"

export const handler = async (request: FollowRequest): Promise<FollowResponse | TweeterResponse> => {
	const followService = new FollowService();

	try {
		const [followerCount, followeeCount] = await followService.unfollow(
			request.token,
			request.user
		);

		return {
			success: true,
			message: undefined,
			followCount: followerCount,
			followCount2: followeeCount
		}
	}
	catch (e: any) {
		return {
			success: false,
			message: e.message ?? "Error when unfollowing"
		}
	}
}