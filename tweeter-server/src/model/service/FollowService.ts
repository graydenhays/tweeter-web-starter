import { UserDto } from "tweeter-shared";
import { FollowFactory } from "../../dao/factories/FollowFactory";
import { FollowDAO } from "../../dao/interfaces/FollowDAO";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
// import { FollowEntity } from "tweeter-shared/src/model/dto/entity/FollowEntity";
import { FollowerEntity } from "tweeter-shared";
// import { DataPage } from "tweeter-shared/src/model/dto/entity/DataPage";

export class FollowService {
	followFactory = new FollowFactory();
	// followerDAO: FollowDAO;
	// followeeDAO: FollowDAO;
	followDAO: FollowDAO;
	authDAO: AuthDAO;

	constructor() {
		// this.followerDAO = this.followFactory.createFollowerDAO();
		// this.followeeDAO = this.followFactory.createFolloweeDAO();
		this.followDAO = this.followFactory.createFollowDAO();
		this.authDAO = this.followFactory.createAuthDAO();
	}
	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDto | null
	  ): Promise<[UserDto[], boolean]> {
		await this.checkToken(token);
		return this.followDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
	  };

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDto | null
	): Promise<[UserDto[], boolean]> {
		// await this.checkToken(token);
		return this.followDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
	};

	public async getIsFollowerStatus(
		token: string,
		user: UserDto,
		selectedUser: UserDto
	): Promise<boolean> {
		await this.checkToken(token);
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
		await this.checkToken(token);
		return this.followDAO.getFolloweesCount(user.alias);
	};

	public async getFollowerCount(
		token: string,
		user: UserDto
	): Promise<number> {
		await this.checkToken(token);
		return this.followDAO.getFollowersCount(user.alias);
	};

	public async follow(
		token: string,
		userToFollow: UserDto
	): Promise<[followerCount: number, followeeCount: number]> {
		const currentUserDto = await this.checkToken(token);

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
		const currentUserDto = await this.checkToken(token);

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

	private async checkToken(token: string): Promise<UserDto> {
		const authToken = await this.authDAO.checkToken(token);
		if (authToken === undefined) {
			throw new Error("User not authorized");
		} else if (Date.now() - authToken[0].timestamp > 900000) {
			this.authDAO.deleteToken(token);
			throw new Error("Session timed out");
		}
		return authToken[1]
	}
}