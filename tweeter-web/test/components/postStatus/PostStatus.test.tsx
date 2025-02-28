import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import React from "react";
import { userEvent } from "@testing-library/user-event";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import userInfoHook from "../../../src/components/userInfo/UserInfoHook";
import { MouseEvent as ReactMouseEvent } from "react";
import '@testing-library/jest-dom';


jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
	...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
	__esModule: true,
	default: jest.fn(),
}));

describe("PostStatus Component", () => {
	let mockAuthToken = mock<AuthToken>();
	let mockUser = mock<User>();

	const event = {preventDefault: jest.fn()} as unknown as ReactMouseEvent<Element, MouseEvent>;
	const authToken = new AuthToken("abc123", Date.now());
	const currentUser = new User(
		"firstName",
		"lastName",
		"alias",
		"imageURL"
	);
	const post = "I am a post";
	beforeAll(() => {
		mockAuthToken = mock<AuthToken>();
		const mockAuthTokenInstance = instance(mockAuthToken);

		mockUser = mock<User>();
		const mockUserInstance = instance(mockUser);

		(userInfoHook as jest.Mock).mockReturnValue({
			currentUser: mockUserInstance,
			authToken: mockAuthTokenInstance,
		});
	});
	it("start with Post Status and Clear buttons disabled", () => {
		const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
		expect(postStatusButton).toBeDisabled();
		expect(clearButton).toBeDisabled();
	});
	it("enables buttons when text field has text", async () => {
		const { postStatusButton, clearButton, postStatusText, user } = renderPostStatusAndGetElement();

		await user.type(postStatusText, "a");

		expect(postStatusButton).toBeEnabled();
		expect(clearButton).toBeEnabled();
	});
	it("disables buttons when text field is cleared", async () => {
		const {
			postStatusButton,
			clearButton,
			postStatusText,
			user
		} = renderPostStatusAndGetElement();

		console.log(postStatusButton);

		await user.type(postStatusText, "a");

		expect(postStatusButton).toBeEnabled();
		expect(clearButton).toBeEnabled();

		await user.clear(postStatusText);

		expect(postStatusButton).toBeDisabled();
		expect(clearButton).toBeDisabled();
	});
	it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
		const mockPresenter = mock<PostStatusPresenter>();
		const mockPresenterInstance = instance(mockPresenter);

		const {
			postStatusButton,
			clearButton,
			postStatusText,
			user
		} = renderPostStatusAndGetElement();

		await user.type(postStatusText, "a");
		await user.click(postStatusButton);

		verify(mockPresenter.submitPost(event, authToken, currentUser, post));
	});
});

const renderPostStatus = () => {
	return render(
		<MemoryRouter>
			<PostStatus/>
		</MemoryRouter>
	);
};

const renderPostStatusAndGetElement = () => {
	const user = userEvent.setup();

	renderPostStatus();

	const clearButton = screen.getByLabelText("clear");
	const postStatusButton = screen.getByLabelText("postStatus");
	const postStatusText = screen.getByLabelText("postStatusText");

	return { postStatusButton, clearButton, postStatusText, user }
}