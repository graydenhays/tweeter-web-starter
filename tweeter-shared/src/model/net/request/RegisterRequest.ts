import { AuthRequest } from "./AuthRequest";

export interface RegisterRequest extends AuthRequest {
	readonly firstName: string,
	readonly lastName: string,
	readonly userImageBytes: Uint8Array | string,
	readonly imageFileExtension: string
}