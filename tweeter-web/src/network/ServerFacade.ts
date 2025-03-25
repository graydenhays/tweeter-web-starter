import {
	AuthRequest,
	AuthResponse,
	AuthToken,
	FollowCountResponse,
	FollowRequest,
	FollowResponse,
	GetUserRequest,
	GetUserResponse,
	IsFollowerRequest,
	IsFollowerResponse,
	PagedUserItemRequest,
	PagedUserItemResponse,
	RegisterRequest,
	TweeterRequest,
	TweeterResponse,
	User,
	UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
	private SERVER_URL = "https://sd17k1pxq7.execute-api.us-east-2.amazonaws.com/dev";

	private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

	// UserService

	public async getUser(
		request: GetUserRequest
	): Promise<UserDto> {
		const response = await this.clientCommunicator.doPost<
			GetUserRequest,
			GetUserResponse
		>(request, "/getUser");

		const user: UserDto | null =
		response.success && response.returnedUser
			?	response.returnedUser
			:	null;
		if (response.success) {
			if (user == null) {
				throw new Error(`No user found`);
			} else {
				return user;
			}
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async login (
		request: AuthRequest
	): Promise<[UserDto, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			AuthRequest,
			AuthResponse
		>(request, "/login");

		const user: UserDto | null =
		response.success && response.returnedUser
			?	response.returnedUser
			:	null;
		if (response.success) {
			if (user == null) {
				throw new Error(`Unrecognized user`);
			} else {
				return [user, response.authToken];
			}
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async register (
		request: RegisterRequest
	): Promise<[UserDto, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			RegisterRequest,
			AuthResponse
		>(request, "/register");

		const user: UserDto | null =
		response.success && response.returnedUser
			?	response.returnedUser
			:	null;
		if (response.success) {
			if (user == null) {
				throw new Error(`User could not be registered`);
			} else {
				return [user, response.authToken];
			}
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async logout (
		request: TweeterRequest
	): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			TweeterRequest,
			TweeterResponse
		>(request, "/logout");

		if (!response.success) {
			console.error(response);
			throw new Error(response.message);
		}
	}

	// FollowService

	public async getIsFollowerStatus(
		request: IsFollowerRequest
	): Promise<boolean> {
		const response = await this.clientCommunicator.doPost<
			IsFollowerRequest,
			IsFollowerResponse
		>(request, "/isFollowerStatus");

		if (response.success) {
			return response.isFollower
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async getFolloweeCount(
		request: FollowRequest
	): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowCountResponse
		>(request, "/getFolloweeCount");

		if (response.success) {
			return response.followCount
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async getFollowerCount(
		request: FollowRequest
	): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowCountResponse
		>(request, "/getFollowerCount");

		if (response.success) {
			return response.followCount
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async follow(
		request: FollowRequest
	): Promise<[number, number]> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowResponse
		>(request, "/follow");

		if (response.success) {
			return [response.followCount, response.followCount2]
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async unfollow(
		request: FollowRequest
	): Promise<[number, number]> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowResponse
		>(request, "/unfollow");

		if (response.success) {
			return [response.followCount, response.followCount2]
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async getMoreFollowees(
		request: PagedUserItemRequest
	): Promise<[User[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedUserItemRequest,
			PagedUserItemResponse
		>(request, "/followee/list");

		// Convert the UserDto array returned by ClientCommunicator to a User array
		const items: User[] | null =
		response.success && response.items
			? response.items.map((dto) => User.fromDto(dto) as User)
			: null;

		// Handle errors
		if (response.success) {
			if (items == null) {
				throw new Error(`No followees found`);
			} else {
				return [items, response.hasMore];
			}
		} else {
			console.error(response);
			throw new Error(response.message);
		}
	}

	// StatusService
}