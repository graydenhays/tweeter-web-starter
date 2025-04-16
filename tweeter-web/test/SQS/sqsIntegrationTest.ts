// import { AuthToken, Status, User } from "tweeter-shared";
// import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
// import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
// import { StatusService } from "../../src/model/service/StatusService";
// import { ServerFacade } from "../../src/network/ServerFacade";
// import { ClientCommunicator } from "../../src/network/ClientCommunicator";

// describe("PostStatusIntegrationTest", () => {
//   let mockView: PostStatusView;
//   let presenter: PostStatusPresenter;
//   let mockClientComm: ClientCommunicator;

//   const authToken = new AuthToken("token", Date.now());
//   const user = new User("Test", "User", "@test", "image.url");
//   const postText = "Test post";
//   let status: Status;

//   beforeAll(() => {
//     status = new Status(postText, user, Date.now());
//   });

//   beforeEach(() => {
//     mockView = mock<PostStatusView>();
//     mockClientComm = mock<ClientCommunicator>();

//     const serverFacade = new ServerFacade();
//     serverFacade.clientCommunicator = instance(mockClientComm);

//     const realService = new StatusService();
//     const serviceSpy = spy(realService);
//     when(serviceSpy["serverFacade"]).thenReturn(serverFacade);

//     presenter = new PostStatusPresenter(instance(mockView));
//     const presenterSpy = spy(presenter);
//     when(presenterSpy.statusService).thenReturn(instance(serviceSpy));

//     // Mock API responses
//     when(mockClientComm.doPost(anything(), "/postStatus"))
//       .thenResolve({ success: true, message: "Success!" });
//     when(mockClientComm.doPost(anything(), "/getStory"))
//       .thenResolve({
//         items: [status],
//         hasMore: false,
//         success: true
//       });
//   });

//   it("shows posting status message and clears on success", async () => {
//     await presenter.submitPost(
//       { preventDefault: () => {} } as React.MouseEvent,
//       authToken,
//       user,
//       postText
//     );

//     verify(mockView.displayInfoMessage("Posting status...", 0)).once();
//     verify(mockView.clearLastInfoMessage()).once();
//     verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
//   });

//   it("sends correct status data to server", async () => {
//     await presenter.submitPost(
//       { preventDefault: () => {} } as React.MouseEvent,
//       authToken,
//       user,
//       postText
//     );

//     const [postRequest] = capture(mockClientComm.doPost).last();
//     expect(postRequest).toEqual({
//       token: authToken,
//       newStatus: status
//     });
//   });

//   it("updates user story with new status", async () => {
//     await presenter.submitPost(
//       { preventDefault: () => {} } as React.MouseEvent,
//       authToken,
//       user,
//       postText
//     );

//     const [storyRequest] = capture(mockClientComm.doPost).beforeLast();
//     expect(storyRequest).toEqual({
//       authToken: authToken,
//       user: user,
//       pageSize: 10,
//       lastItem: null
//     });
//   });

//   it("handles post failure gracefully", async () => {
//     when(mockClientComm.doPost(anything(), "/postStatus"))
//       .thenReject(new Error("API failure"));

//     await presenter.submitPost(
//       { preventDefault: () => {} } as React.MouseEvent,
//       authToken,
//       user,
//       postText
//     );

//     verify(mockView.displayErrorMessage(anything())).once();
//     verify(mockView.displayInfoMessage("Status posted!", 2000)).never();
//   });
// });
