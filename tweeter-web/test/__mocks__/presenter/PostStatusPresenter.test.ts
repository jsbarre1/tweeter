import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/presenter/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("John", "Doe", "@johndoe", "image.jpg");
  const post = "This is a test status post";
  let mockStatusService: StatusService;

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );

    postStatusPresenter = instance(postStatusPresenterSpy);
    mockStatusService = mock<StatusService>();

    when(postStatusPresenterSpy.statusService).thenReturn(
      instance(mockStatusService)
    );

    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "toast123"
    );

    when(mockStatusService.postStatus(anything(), anything())).thenResolve();
  });

  it("The presenter tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("The presenter calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockStatusService.postStatus(anything(), anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();

    expect(capturedAuthToken).toBe(authToken);
    expect(capturedStatus.post).toBe(post);
    expect(capturedStatus.user).toBe(currentUser);
  });

  it("When posting of the status is successful, the presenter tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockPostStatusView.deleteMessage("toast123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("When posting of the status is not successful, the presenter tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("An Error Occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(post, currentUser, authToken);

    verify(mockPostStatusView.displayErrorMessage(anything())).once();
    verify(mockPostStatusView.deleteMessage("toast123")).once();
    verify(mockPostStatusView.setPost(anything())).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
