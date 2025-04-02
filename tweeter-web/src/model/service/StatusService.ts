import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    private serverFacade = new ServerFacade();
    public async loadMoreStoryItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null,
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getMoreStatusItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null
          }, "/story/list"
        );
    };

    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null,
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        //return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
        return await this.serverFacade.getMoreStatusItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null
          }, "/feed/list"
        );
    };

    public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
        await this.serverFacade.postStatus({
            token: authToken.token,
            newStatus: newStatus.dto
        });
    };
}