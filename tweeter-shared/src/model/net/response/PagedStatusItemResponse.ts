import { PostDto } from "../../dto/PostDto";
import { TweeterResponse } from "./TweeterResponse";
export interface PagedStatusItemResponse extends TweeterResponse {
    readonly items: PostDto[] | null;
    readonly hasMore: boolean;
}