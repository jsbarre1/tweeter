import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  instance,
  mock,
  verify,
} from "@typestrong/ts-mockito";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

jest.mock("../../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUserInstance = new User("John", "Doe", "@johndoe", "image.jpg");
  const mockAuthTokenInstance = new AuthToken("abc123", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text", async () => {
    const { postStatusButton, clearButton, textArea, user } =
      renderPostStatusAndGetElements();

    await user.type(textArea, "Test status");

    await waitFor(() => expect(postStatusButton).toBeEnabled());
    expect(clearButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared", async () => {
    const { postStatusButton, clearButton, textArea, user } =
      renderPostStatusAndGetElements();

    await user.type(textArea, "Test status");
    await waitFor(() => expect(postStatusButton).toBeEnabled());

    await user.clear(textArea);
    await waitFor(() => expect(postStatusButton).toBeDisabled());
    expect(clearButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const post = "Test status message";

    const { postStatusButton, textArea, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(textArea, post);

    await waitFor(() => expect(postStatusButton).toBeEnabled());

    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);
  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textArea = screen.getByPlaceholderText("What's on your mind?");

  return { user, postStatusButton, clearButton, textArea };
}
