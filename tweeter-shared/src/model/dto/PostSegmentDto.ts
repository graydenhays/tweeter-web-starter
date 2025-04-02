export enum Type {
	text = "Text",
	alias = "Alias",
	url = "URL",
	newline = "Newline",
}

export interface PostSegmentDto {
	readonly text: string,
	readonly startPos: number,
	readonly endPos: number,
	readonly type: Type
}