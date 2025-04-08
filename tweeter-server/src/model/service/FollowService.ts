import { UserDto } from "tweeter-shared";
import { FollowFactory } from "../../dao/factories/FollowFactory";
import { FollowDAO } from "../../dao/interfaces/FollowDAO";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { FollowerEntity } from "tweeter-shared";
import { UserDAO } from "../../dao/interfaces/UserDAO";

export class FollowService {
	followFactory = new FollowFactory();
	followDAO: FollowDAO;
	authDAO: AuthDAO;
	userDAO: UserDAO;

	constructor() {
		this.followDAO = this.followFactory.createFollowDAO();
		this.authDAO = this.followFactory.createAuthDAO();
		this.userDAO = this.followFactory.createUserDAO();
	}
	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDto | null
	  ): Promise<[UserDto[], boolean]> {
		// await this.checkToken(token);
		return this.followDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
	  };

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDto | null
	): Promise<[UserDto[], boolean]> {
		await this.checkToken(token);
		return this.followDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
	};

	public async getIsFollowerStatus(
		token: string,
		user: UserDto,
		selectedUser: UserDto
	): Promise<boolean> {
		// await this.checkToken(token);
		const followerEntity: FollowerEntity = {
			follower_handle: selectedUser.alias,
			follower_name: selectedUser.firstName + " " + selectedUser.lastName,
			followee_handle: user.alias,
			followee_name: user.firstName + " " + user.lastName,
		}
		const followStatus = this.followDAO.getFollower(followerEntity);
		return !!followStatus
	};

	public async getFolloweeCount(
		token: string,
		user: UserDto
	): Promise<number> {
		// await this.checkToken(token);
		return this.followDAO.getFolloweesCount(user.alias);
	};

	public async getFollowerCount(
		token: string,
		user: UserDto
	): Promise<number> {
		// await this.checkToken(token);
		return this.followDAO.getFollowersCount(user.alias);
	};

	public async follow(
		token: string,
		userToFollow: UserDto
	): Promise<[followerCount: number, followeeCount: number]> {
		// await this.checkToken(token);
		const currentUserAlias = await this.authDAO.getAliasFromToken(token);
		if (!currentUserAlias) {
			throw new Error("[ServerError]: Couldn't validate authentication token");
		}

		const currentUser = await this.userDAO.getUser(currentUserAlias);

		if (!currentUser) {
			throw new Error("[ServerError]: Couldn't get user information");
		}

		const currentUserDto = currentUser[0]

		const followerEntity: FollowerEntity = {
			follower_handle: currentUserDto.alias,
			follower_name: currentUserDto.firstName + " " + currentUserDto.lastName,
			followee_handle: userToFollow.alias,
			followee_name: userToFollow.firstName + " " + userToFollow.lastName,
		}

		await this.followDAO.putFollower(followerEntity)

		const followerCount = await this.getFollowerCount(token, userToFollow);
		const followeeCount = await this.getFolloweeCount(token, userToFollow);

		return [followerCount, followeeCount];
	};

	public async unfollow(
		token: string,
		userToUnfollow: UserDto
	): Promise<[followerCount: number, followeeCount: number]> {
		// await this.checkToken(token);
		const currentUserAlias = await this.authDAO.getAliasFromToken(token);
		if (!currentUserAlias) {
			throw new Error("[ServerError]: Couldn't validate authentication token");
		}

		const currentUser = await this.userDAO.getUser(currentUserAlias);

		if (!currentUser) {
			throw new Error("[ServerError]: Couldn't get user information");
		}

		const currentUserDto = currentUser[0]

		const followerEntity: FollowerEntity = {
			follower_handle: currentUserDto.alias,
			follower_name: currentUserDto.firstName + " " + currentUserDto.lastName,
			followee_handle: userToUnfollow.alias,
			followee_name: userToUnfollow.firstName + " " + userToUnfollow.lastName,
		}

		await this.followDAO.deleteFollower(followerEntity);

		const followerCount = await this.getFollowerCount(token, userToUnfollow);
		const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

		return [followerCount, followeeCount];
	};

	private async checkToken(token: string): Promise<void> {
        const validToken = await this.authDAO.checkToken(token);
        if (!validToken) {
			this.authDAO.deleteToken(token);
			throw new Error("[BadRequest]: Session timed out");
		}
    }
}