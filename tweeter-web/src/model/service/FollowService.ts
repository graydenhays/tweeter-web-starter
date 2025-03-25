import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
	private facade = new ServerFacade();

	public async loadMoreFollowers(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	  ): Promise<[User[], boolean]> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
	  };

	public async loadMoreFollowees(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	): Promise<[User[], boolean]> {
		// TODO: Replace with the result of calling server
		// return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
		return await this.facade.getMoreFollowees({
			token: authToken.token,
			userAlias: userAlias,
			pageSize: pageSize,
			lastItem: lastItem
		});
	};

	public async getIsFollowerStatus(
		authToken: AuthToken,
		user: User,
		selectedUser: User
	): Promise<boolean> {
		// TODO: Replace with the result of calling server
		// return FakeData.instance.isFollower();
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
		// TODO: Replace with the result of calling server
		// return FakeData.instance.getFolloweeCount(user.alias);
		return await this.facade.getFolloweeCount({
			token: authToken.token,
			user: user.dto
		})
	};

	public async getFollowerCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		// TODO: Replace with the result of calling server
		// return FakeData.instance.getFollowerCount(user.alias);
		return await this.facade.getFollowerCount({
			token: authToken.token,
			user: user.dto
		})
	};

	public async follow(
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		// Pause so we can see the follow message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		// const followerCount = await this.getFollowerCount(authToken, userToFollow);
		// const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

		// return [followerCount, followeeCount];
		return await this.facade.follow({
			token: authToken.token,
			user: userToFollow.dto
		})
	};

	public async unfollow(
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		// Pause so we can see the unfollow message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		// const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
		// const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

		// return [followerCount, followeeCount];
		return await this.facade.unfollow({
			token: authToken.token,
			user: userToUnfollow.dto
		})
	};
}