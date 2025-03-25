export enum Type {
	text = "Text",
	alias = "Alias",
	url = "URL",
	newline = "Newline",
}

export interface PostSegmentDto {
	text: string,
	startPos: number,
	endPos: number,
	type: Type
}