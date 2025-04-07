import { AuthToken, UserDto } from "tweeter-shared";
import { UserDAO } from "../../dao/interfaces/UserDAO";
import { UserFactory } from "../../dao/factories/UserFactory";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { S3DAO } from "../../dao/interfaces/S3DAO";
import bcrypt from "bcryptjs";

export class UserService {
	userFactory = new UserFactory();
	userDAO: UserDAO;
	authDAO: AuthDAO;
	s3DAO: S3DAO;

	constructor() {
		this.userDAO = this.userFactory.createUserDAO();
		this.authDAO = this.userFactory.createAuthDAO();
		this.s3DAO = this.userFactory.createS3DAO();
	}

	public async login(
		alias: string,
		password: string
	): Promise<[UserDto, AuthToken]> {
		let userDto: UserDto;

		const userData = await this.userDAO.getUser(alias);
		if (userData && userData[1]) {
			// const validPassword = await bcrypt.compare(password, userData[1])
			if (password === userData[1]) {
				userDto = userData[0];
			} else {
				throw new Error("Invalid password");
			}
		}
		else {
			throw new Error("Invalid alias or password"); // throw a 400 error here??
		}

		// generate auth token
		const authToken = AuthToken.Generate();
		this.authDAO.putToken(authToken, userDto);

		return [userDto, authToken]
	};

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageStringBase64: string,
		imageFileExtension: string
	): Promise<[UserDto, AuthToken]> {
		if (
			(firstName === "" || firstName === null)
			|| (lastName === "" || lastName === null)
			|| (alias === "" || alias === null)
			|| (password === "" || password === null)
			|| (imageStringBase64 === "" || imageStringBase64 === null)
		) {
			throw new Error("Invalid registration"); // throw a 400 error here? necessary error check?
		}

		// register image with s3
		const fileName = alias + imageFileExtension;
		const url = await this.s3DAO.putImage(fileName, imageStringBase64);

		const userDto = {
			alias: alias,
			firstName: firstName,
			lastName: lastName,
			imageUrl: url
		}

		// salting
		// const salt = await bcrypt.genSalt();
		// const hashedPassword = await bcrypt.hash(password, salt);
		// await this.userDAO.putUser(userDto, hashedPassword);
		await this.userDAO.putUser(userDto, password);

		// generate auth token
		const authToken = AuthToken.Generate();
		this.authDAO.putToken(authToken, userDto);

		return [userDto, authToken]
	};

	public async getUser (
		token: string,
		alias: string
	): Promise<UserDto | null> {
		this.checkToken(token);

		const userData = await this.userDAO.getUser(alias);
		return userData ? userData[0] : null
	};

	public async logout (token: string): Promise<void> {
		this.authDAO.deleteToken(token);
	};

	private async checkToken(token: string): Promise<void> {
        const authToken = await this.authDAO.checkToken(token);
        if (authToken === undefined) {
            throw new Error("User not authorized");
        } else if (Date.now() - authToken[0].timestamp > 900000) {
			this.authDAO.deleteToken(token);
			throw new Error("Session timed out");
		}
    }
}