import { UserDto } from "tweeter-shared";
// import { DataPage } from "tweeter-shared/src/model/dto/entity/DataPage";
// import { FollowEntity } from "tweeter-shared/src/model/dto/entity/FollowEntity";
import { TweeterDAO } from "./TweeterDAO";
import { FollowerEntity } from "tweeter-shared";

export interface FollowDAO extends TweeterDAO {
	readonly indexName: string;
	readonly follower_handle_attr: string;
	// readonly follower_firstName_attr: string;
	// readonly follower_lastName_attr: string;
	// readonly follower_imageUrl_attr: string;
	readonly followee_handle_attr: string;
	// readonly followee_firstName_attr: string;
	// readonly followee_lastName_attr: string;
	// readonly followee_imageUrl_attr: string;
	readonly follower_name_attr: string;
	readonly followee_name_attr: string;

	// putFollow(follower: FollowEntity): Promise<void>;
	putFollower(follower: FollowerEntity): Promise<void>;
	// updateFollow(follower: FollowEntity): Promise<void>;
	updateFollower(follower: FollowerEntity): Promise<void>;
	// getFollow(follower: FollowEntity): Promise<FollowEntity | undefined>;
	getFollower(follower: FollowerEntity): Promise<FollowerEntity | undefined>;
	// deleteFollow(follower: FollowEntity): Promise<void>;
	deleteFollower(follower: FollowerEntity): Promise<void>;
	// getPageOfFollowees(
	// 	followerHandle: string,
	// 	pageSize: number,
	// 	lastFolloweeHandle: string | undefined
	// ): Promise<DataPage<FollowerEntity>>;
	getPageOfFollowees(
		followerHandle: string,
		pageSize: number,
		lastFolloweeHandle: string | undefined
	): Promise<[UserDto[], boolean]>;
	// getPageOfFollowers(
	// 	followeeHandle: string,
	// 	pageSize: number,
	// 	lastFollowerHandle: string | undefined
	// ): Promise<DataPage<FollowerEntity>>;
	getPageOfFollowers(
		followeeHandle: string,
		pageSize: number,
		lastFollowerHandle: string | undefined
	): Promise<[UserDto[], boolean]>;
	getFollowersCount(followeeHandle: string): Promise<number>;
	getFolloweesCount(followerHandle: string): Promise<number>;
	// generateFollowItem(follower: FollowEntity): {
	// 	follower_handle: string;
	// 	followee_handle: string;
	// };
}