import { AuthRequest } from "./AuthRequest";

export interface RegisterRequest extends AuthRequest {
	firstName: string,
	lastName: string,
	userImageBytes: Uint8Array,
	imageFileExtension: string
}