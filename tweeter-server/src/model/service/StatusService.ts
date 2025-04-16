import { StatusDto, UserDto } from "tweeter-shared";
import { StatusFactory } from "../../dao/factories/StatusFactory";
import { StatusDAO } from "../../dao/interfaces/StatusDAO";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";

export class StatusService {
    statusFactory = new StatusFactory();
    storyDAO: StatusDAO;
    feedDAO: StatusDAO;
    authDAO: AuthDAO;

    constructor() {
        this.storyDAO = this.statusFactory.createStoryDAO();
        this.feedDAO = this.statusFactory.createFeedDAO();
        this.authDAO = this.statusFactory.createAuthDAO();
    }

    public async loadMoreStoryItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null,
    ): Promise<[StatusDto[], boolean]> {
        // this.checkToken(token);
        return await this.storyDAO.loadMoreItems(userAlias, pageSize, lastItem, 'story');
    };

    public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null,
    ): Promise<[StatusDto[], boolean]> {
        // this.checkToken(token);
        return await this.feedDAO.loadMoreItems(userAlias, pageSize, lastItem, 'feed');
    };

    public async postStatus (
        token: string,
        newStatus: StatusDto
      ): Promise<void> {
        // await this.checkToken(token);
        await this.storyDAO.putStatus(newStatus);
    };

    public async batchFeedUpdate (
        followers: UserDto[],
        status: StatusDto
    ): Promise<void> {
        await this.feedDAO.batchFeedUpdate(followers, status);
    };

    private async checkToken(token: string): Promise<void> {
        const validToken = await this.authDAO.checkToken(token);
        if (!validToken) {
			this.authDAO.deleteToken(token);
			throw new Error("[BadRequest]: Session timed out");
		}
    }
}