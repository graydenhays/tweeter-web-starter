import { StatusDynamoDBDAO } from "../StatusDynamoDBDAO";
import { TweeterFactory } from "./TweeterFactory";

export class StatusFactory extends TweeterFactory {
	createFeedDAO() {
		return new StatusDynamoDBDAO("feed");
	}
	createStoryDAO() {
		return new StatusDynamoDBDAO("story");
	}
}