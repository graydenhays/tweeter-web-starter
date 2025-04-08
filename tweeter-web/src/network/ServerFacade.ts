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
	PagedStatusItemRequest,
	PagedStatusItemResponse,
	PagedUserItemRequest,
	PagedUserItemResponse,
	PostStatusRequest,
	RegisterRequest,
	Status,
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
	public async getAuth (
		request: AuthRequest | RegisterRequest,
		path: string,
		message: string
	): Promise<[UserDto, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			AuthRequest,
			AuthResponse
		>(request, path);

		const user: UserDto | null =
		response.success && response.returnedUser
			?	response.returnedUser
			:	null;
		if (response.success) {
			if (user == null) {
				throw new Error(message);
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
	public async getFollowCount(
		request: FollowRequest,
		path: string
	): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowCountResponse
		>(request, path);

		if (response.success) {
			return response.followCount
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async followUnfollow(
		request: FollowRequest,
		path: string
	): Promise<[number, number]> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			FollowResponse
		>(request, path);

		if (response.success) {
			return [response.followCount, response.followCount2]
		}
		else {
			console.error(response);
			throw new Error(response.message);
		}
	}
	public async getMoreFollows(
		request: PagedUserItemRequest,
		path: string
	  ): Promise<[User[], boolean]> {
		const response = await this.clientCommunicator.doPost<
		  PagedUserItemRequest,
		  PagedUserItemResponse
		>(request, path);

		// Convert the UserDto array returned by ClientCommunicator to a User array
		const items: User[] | null =
		  response.success && response.items
			? response.items.map((dto) => User.fromDto(dto) as User)
			: null;

		// Handle errors
		if (response.success) {
		  if (items == null) {
			throw new Error(`No followers or followees found`);
		  } else {
			return [items, response.hasMore];
		  }
		} else {
		  console.error(response);
		  throw new Error(response.message);
		}
	}

	// StatusService

	public async getMoreStatusItems(
		request: PagedStatusItemRequest,
		path: string
	  ): Promise<[Status[], boolean]> {
		const response = await this.clientCommunicator.doPost<
		  PagedStatusItemRequest,
		  PagedStatusItemResponse
		>(request, path);

		// Convert the StatusDto array returned by ClientCommunicator to a User array
		const items: Status[] | null =
		  response.success && response.items
			? response.items.map((dto) => {
				return Status.fromDto(dto)!
			})
			: null;

		// Handle errors
		if (response.success) {
		  if (items == null) {
			throw new Error(`No status items found`);
		  } else {
			return [items, response.hasMore];
		  }
		} else {
		  console.error(response);
		  throw new Error(response.message);
		}
	  }
	  public async postStatus(
		request: PostStatusRequest,
	  ): Promise<void>  {
		const response = await this.clientCommunicator.doPost<
		  PostStatusRequest,
		  TweeterResponse
		>(request, "/postStatus");
		// Handle errors
		if (response.success) {
			return;
		} else {
		  console.error(response);
		  throw new Error(response.message);
		}
	  }
}