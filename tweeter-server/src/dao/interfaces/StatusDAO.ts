import { PostDto, StatusDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";

export interface StatusDAO extends TweeterDAO {
	readonly user_handle_attr: string,
	readonly post_attr: string,
    readonly timestamp_attr: string,
    readonly firstName_attr: string,
	readonly lastName_attr: string,
	readonly imageUrl_attr: string

	loadMoreItems(
		userAlias: string,
        pageSize: number,
        lastItem: StatusDto | undefined | null,
    ): Promise<[PostDto[], boolean]>;
	putStatus(status: StatusDto): Promise<void>
}