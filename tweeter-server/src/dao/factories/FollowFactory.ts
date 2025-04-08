import { FollowDynamoDBDAO } from "../FollowDynamoDBDAO";
import { UserDynamoDBDAO } from "../UserDynamoDBDAO";
import { TweeterFactory } from "./TweeterFactory";

export class FollowFactory extends TweeterFactory {
	createFollowDAO() {
		return new FollowDynamoDBDAO();
	}
	createUserDAO() {
		return new UserDynamoDBDAO();
	}
}