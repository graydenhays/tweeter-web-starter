import { StatusDto, UserDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";
import { FollowerEntity } from "tweeter-shared";

export interface FollowDAO extends TweeterDAO {
	readonly indexName: string;
	readonly follower_handle_attr: string;
	readonly followee_handle_attr: string;
	readonly follower_name_attr: string;
	readonly followee_name_attr: string;

	putFollower(follower: FollowerEntity): Promise<void>;
	// updateFollower(follower: FollowerEntity): Promise<void>;
	getFollower(follower: FollowerEntity): Promise<FollowerEntity | undefined>;
	deleteFollower(follower: FollowerEntity): Promise<void>;
	getPageOfFollowees(
		followerHandle: string,
		pageSize: number,
		lastFolloweeHandle: string | undefined
	): Promise<[UserDto[], boolean]>;
	getPageOfFollowers(
		followeeHandle: string,
		pageSize: number,
		lastFollowerHandle: string | undefined
	): Promise<[UserDto[], boolean]>;
	getFollowersCount(followeeHandle: string): Promise<number>;
	getFolloweesCount(followerHandle: string): Promise<number>;
	getAllFollowers(status: StatusDto): Promise<Record<string, any>[] | undefined>;
}