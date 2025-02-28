import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons"
import { AuthView } from "../../../../src/presenters/AuthPresenter";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito"

library.add(fab);

describe("Login Component", () => {
	it("start with sign-in button disabled", () => {
		const { signInButton } = renderLoginAndGetElement("/", presenterGenerator);
		expect(signInButton).toBeDisabled();
	});

	it("enables the sign-in button if both alias and password fields have text", async () => {
		const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/", presenterGenerator);

		await user.type(aliasField, "a");
		await user.type(passwordField, "b");

		expect(signInButton).toBeEnabled();
	});

	it("disable the sign in button if either field is cleared", async () => {
		const { signInButton, aliasField, passwordField, user } =
		renderLoginAndGetElement("/", presenterGenerator);

		await user.type(aliasField, "a");
		await user.type(passwordField, "b");
		expect(signInButton).toBeEnabled();

		await user.clear(aliasField);
		expect(signInButton).toBeDisabled();

		await user.type(aliasField, "1");
		expect(signInButton).toBeEnabled();

		await user.clear(passwordField);
		expect(signInButton).toBeDisabled();
	});

	it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
		const mockPresenter = mock<LoginPresenter>();
		const mockPresenterInstance = instance(mockPresenter);

		const originalUrl = "http://someurl.com";
		const alias = "@SomeAlias";
		const password = "myPassword";
		const rememberMe = true;

		const { signInButton, aliasField, passwordField, user } =
		renderLoginAndGetElement("/", presenterGenerator, mockPresenterInstance);

		await user.type(aliasField, alias);
		await user.type(passwordField, password);

		await user.click(signInButton);

		verify(mockPresenter.doLogin(originalUrl, alias, password, rememberMe));
	});
});

const presenterGenerator = (view: AuthView) => new LoginPresenter(view);

const renderLogin = (originalUrl: string, presenterGenerator: (view: AuthView) => LoginPresenter, presenter?: LoginPresenter) => {
	return render(
		<MemoryRouter>
			{!!presenter ?
				(<Login
					originalUrl={originalUrl}
					presenter={presenter}
					presenterGenerator={presenterGenerator}
				/>) :
				(<Login
					originalUrl={originalUrl}
					presenterGenerator={presenterGenerator}
				/>)
			}
		</MemoryRouter>
	);
};

const renderLoginAndGetElement = (originalUrl: string, presenterGenerator: (view: AuthView) => LoginPresenter, presenter?: LoginPresenter) => {
	const user = userEvent.setup();

	renderLogin(originalUrl, presenterGenerator, presenter);

	const signInButton = screen.getByLabelText("submit");
	const aliasField = screen.getByLabelText("alias");
	const passwordField = screen.getByLabelText("password");

	return { signInButton, aliasField, passwordField, user }
}