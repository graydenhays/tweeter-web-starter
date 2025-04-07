import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
	private facade = new ServerFacade();

	public async loadMoreFollowers(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	  ): Promise<[User[], boolean]> {
        return await this.facade.getMoreFollows({
			token: authToken.token,
			userAlias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem ? lastItem.dto : null
		  }, "/follower/list"
		);
	  };

	public async loadMoreFollowees(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	): Promise<[User[], boolean]> {
		return await this.facade.getMoreFollows({
			token: authToken.token,
			userAlias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem ? lastItem.dto : null
		}, "/followee/list");
	};

	public async getIsFollowerStatus(
		authToken: AuthToken,
		user: User,
		selectedUser: User
	): Promise<boolean> {
		return await this.facade.getIsFollowerStatus({
			token: authToken.token,
			user: user.dto,
			selectedUser: selectedUser.dto
		})
	};

	public async getFolloweeCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		return await this.facade.getFollowCount({
			token: authToken.token,
			user: user.dto
		}, "/getFolloweeCount")
	};

	public async getFollowerCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		return await this.facade.getFollowCount({
			token: authToken.token,
			user: user.dto
		}, "/getFollowerCount")
	};

	public async follow(
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		return await this.facade.followUnfollow({
			token: authToken.token,
			user: userToFollow.dto
		}, "/follow")
	};

	public async unfollow(
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		return await this.facade.followUnfollow({
			token: authToken.token,
			user: userToUnfollow.dto
		}, "/unfollow")
	};
}