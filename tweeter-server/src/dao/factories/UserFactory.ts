import { S3DynamoDBDAO } from "../S3DynamoDBDAO";
import { UserDynamoDBDAO } from "../UserDynamoDBDAO";
import { TweeterFactory } from "./TweeterFactory";

export class UserFactory extends TweeterFactory {
	createUserDAO() {
		return new UserDynamoDBDAO();
	}
	createS3DAO() {
		return new S3DynamoDBDAO();
	}
}