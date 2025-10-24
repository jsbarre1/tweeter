import { MemoryRouter } from "react-router-dom";
import Login from "../../../../../src/components/authentication/login/Login";
import { render, screen, waitFor } from "@testing-library/react";
import { UserEvent, userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  instance,
  mock,
  verify,
} from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("Starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");

    expect(signInButton).toBeDisabled();
  });

  it("The sign-in button is enabled when both the alias and password fields have text", async () => {
    const { signInButton, aliasField, user, passwordField } =
      renderLoginAndGetElements("/");
    typeUsernamePassword(user, signInButton, aliasField, passwordField);
  });

  it("The sign-in button is disabled if either the alias or password field is cleared", async () => {
    const { signInButton, aliasField, user, passwordField } =
      renderLoginAndGetElements("/");
    await typeUsernamePassword(user, signInButton, aliasField, passwordField);

    await user.clear(aliasField);
    await waitFor(() => expect(signInButton).toBeDisabled());

    await user.type(aliasField, "a");
    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.clear(passwordField);
    await waitFor(() => expect(signInButton).toBeDisabled());
  });

  it("The presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const alias = "myAlias";
    const password = "myPassword";
    const originalUrl = "http://somewhere.com";
    const rememberMe = false;

    const { signInButton, aliasField, user, passwordField } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await waitFor(() => expect(signInButton).toBeEnabled());

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, rememberMe)).once();
  });
});

async function typeUsernamePassword(
  user: UserEvent,
  signInButton: HTMLElement,
  aliasField: HTMLElement,
  passwordField: HTMLElement
) {
  await user.type(aliasField, "a");
  await user.type(passwordField, "b");
  await waitFor(() => expect(signInButton).toBeEnabled());
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElements(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
