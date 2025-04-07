import { AuthDynamoDBDAO } from "../AuthDynamoDBDAO";

export class TweeterFactory {
	createAuthDAO() {
		return new AuthDynamoDBDAO();
	}
}