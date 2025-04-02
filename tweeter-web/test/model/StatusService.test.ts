import "isomorphic-fetch";
import { StatusService } from '../../src/model/service/StatusService';
import { AuthToken } from 'tweeter-shared';
import { Status } from 'tweeter-shared';

describe('StatusService Tests', () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  // Test Load More Story Items Method
  test('load more story items method should return story items', async () => {
    const authToken = new AuthToken('abc123', Date.now());
    const userAlias = 'testuser';
    const pageSize = 10;
    const lastItem: Status | null = null;

    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, lastItem);
    expect(storyItems).toBeDefined();
    expect(hasMore).toBeDefined();
    //strengthen tests
  });
});
