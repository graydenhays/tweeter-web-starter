import { StatusDto } from "../StatusDto";

export class PostEntity {
	post: StatusDto;
	userAlias: string;
	timestamp: number;

	constructor(post: StatusDto, userAlias: string, timestamp: number) {
		this.post = post;
		this.userAlias = userAlias;
		this.timestamp = timestamp;
	}

	toString(): string {
		return (
			"PostEntity{" +
			"post='" +
			this.post +
			"'" +
			"userAlias='" +
			this.userAlias +
			"'" +
			"timestamp='" +
			this.timestamp +
			"'"
		);
	}
}