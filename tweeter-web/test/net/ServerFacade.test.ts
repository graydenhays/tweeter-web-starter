import "isomorphic-fetch";
import { Buffer } from "buffer";
import { ServerFacade } from '../../src/network/ServerFacade';
import {
  RegisterRequest,
  FollowRequest,
  PagedUserItemRequest,
  UserDto,
} from 'tweeter-shared';

describe('ServerFacade Tests', () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  test('register method should successfully register a user', async () => {
    const imageBytes = Buffer.from(new Uint8Array([1, 1, 1, 1, 1, 1, 1])).toString("base64");
	const request: RegisterRequest = {
		token: undefined,
		alias: '@bonnie',
		password: 'password123',
		firstName: 'Test',
		lastName: 'User',
		userImageBytes: imageBytes,
		imageFileExtension: 'jpg',
	  };
    const [user, token] = await serverFacade.register(request);
    expect(user).toBeDefined();
    expect(token).toBeDefined();
  });

  test('get followers method should return followers', async () => {
    const request: PagedUserItemRequest = {
		token: 'a',
		userAlias: '@bonnie',
		pageSize: 10,
		lastItem: null,
    };
    const [followers, hasMore] = await serverFacade.getMoreFollows(request, "/follower/list");
    expect(followers).toBeDefined();
    expect(hasMore).toBeDefined();
  });

  test('get followers count method should return the correct count', async () => {
    const user: UserDto = {
      firstName: 'Test',
      lastName: 'User',
      alias: '@bonnie',
      imageUrl: 'https://example.com/image.jpg',
    };
    const request: FollowRequest = {
		token: '',
		user: user,
    };
    const followersCount = await serverFacade.getFollowerCount(request);
    expect(followersCount).toBeGreaterThan(-1);
  });
});
