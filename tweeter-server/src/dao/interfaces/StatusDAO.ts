import { StatusDto, UserDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";

export interface StatusDAO extends TweeterDAO {
	readonly user_handle_attr: string,
	readonly status_attr: string,
    readonly timestamp_attr: string,

	loadMoreItems(
		userAlias: string,
        pageSize: number,
        lastItem: StatusDto | undefined | null,
		statusType: string
    ): Promise<[StatusDto[], boolean]>;
	putStatus(status: StatusDto): Promise<void>;
	batchFeedUpdate(
		followers: UserDto[],
		status: StatusDto
	): Promise<void>;
}