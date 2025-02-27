import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";
import { MouseEvent as ReactMouseEvent } from "react";

describe("PostStatusPresenter", () => {
	let mockPostStatusPresenterView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;
	let mockStatusService: StatusService;

	const event = {preventDefault: jest.fn()} as unknown as ReactMouseEvent<Element, MouseEvent>;
	const authToken = new AuthToken("abc123", Date.now());
	const currentUser = new User(
		"firstName",
		"lastName",
		"alias",
		"imageURL"
	);
	const post = "I am a post";
	const status = new Status(post, currentUser, Date.now());

	beforeEach(() => {
		mockPostStatusPresenterView = mock<PostStatusView>();
		const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

		const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
		postStatusPresenter = instance(PostStatusPresenterSpy);

		mockStatusService = mock<StatusService>();
		const mockStatusServiceInstance = instance(mockStatusService)

		when(PostStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
	});

	it("tells the view to display a posting status message", async () => {
		await postStatusPresenter.submitPost(
			event,
			authToken,
			currentUser,
			post
		);
		verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
	});

	it("calls postStatus on the post status service with the correct status string and auth token", async () => {
		await postStatusPresenter.submitPost(
			event,
			authToken,
			currentUser,
			post
		);

		let [capturedToken, capturedStatus] = capture(mockStatusService.postStatus).last();
		expect(capturedToken).toEqual(authToken);
		expect(capturedStatus.post).toEqual(status.post);
		expect(capturedStatus.user).toEqual(status.user);
	});

	it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
		await postStatusPresenter.submitPost(
			event,
			authToken,
			currentUser,
			post
		);

		verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
		verify(mockPostStatusPresenterView.setPost("")).once();
		verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();

		verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
	});

	it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
		const error = new Error("An error occurred");

		when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

		await postStatusPresenter.submitPost(
			event,
			authToken,
			currentUser,
			post
		);

		verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
		verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();

		verify(mockPostStatusPresenterView.setPost("")).never();
		verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
	});

});