import { FollowDynamoDBDAO } from "../FollowDynamoDBDAO";
import { TweeterFactory } from "./TweeterFactory";

export class FollowFactory extends TweeterFactory {
	createFollowDAO() {
		return new FollowDynamoDBDAO();
	}
	// createFolloweeDAO() {
	// 	return new FollowDynamoDBDAO("follows", "");
	// }
}