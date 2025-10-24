import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../../src/presenter/AppNavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../../src/model.service/UserService";
describe("AppNavbarPresenter", () => {
  let mockAppnavBarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  const authToken = new AuthToken("abc123", Date.now());
  let mockUserService: UserService;

  beforeEach(() => {
    mockAppnavBarPresenterView = mock<AppNavbarView>();
    const mockAppnavBarPresenterInstance = instance(mockAppnavBarPresenterView);
    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppnavBarPresenterInstance)
    );

    appNavbarPresenter = instance(appNavbarPresenterSpy);
    mockUserService = mock<UserService>();
    when(appNavbarPresenterSpy.userService).thenReturn(
      instance(mockUserService)
    );
    when(mockAppnavBarPresenterView.displayInfoMessage(anything(),0)).thenReturn("toast123")
  });
  it("The presenter tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(
      mockAppnavBarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });
  it("The presenter calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("Tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppnavBarPresenterView.deleteMessage("toast123")).once();
    verify(mockAppnavBarPresenterView.clearUserInfo()).once();
    verify(mockAppnavBarPresenterView.navigateToPath("/login")).once();
    verify(mockAppnavBarPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
    let error = new Error("An Error Occured");
    when(mockUserService.logout(anything())).thenThrow(error);
    await appNavbarPresenter.logOut(authToken);
    verify(
      mockAppnavBarPresenterView.displayErrorMessage(
        "Failed to log user out because of exeption: An error occured"
      )
    );
    verify(mockAppnavBarPresenterView.deleteMessage(anything())).never();
    verify(mockAppnavBarPresenterView.clearUserInfo()).never();
    verify(mockAppnavBarPresenterView.navigateToPath("/login")).never();
  });
});
