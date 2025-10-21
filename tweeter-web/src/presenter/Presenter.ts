export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;
  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }
  protected async doAuthenticationOperation(
    navigate: () => Promise<void>,
    notify: () => void,
    operationDescription: string,
    view?: { setIsLoading: (isLoading: boolean) => void }
  ) {
    try {
      if (view) {
        view.setIsLoading(true);
      }
      await navigate();
      notify();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (view) {
        view.setIsLoading(false);
      }
    }
  }

  protected async doFollowUnfollowOperation(
    operation: () => Promise<void>,
    notify: () => void,
    operationDescription: string,
    view: MessageView & { setIsLoading: (isLoading: boolean) => void }
  ): Promise<void> {
    let toastId = "";
    try {
      view.setIsLoading(true);
      toastId = view.displayInfoMessage(operationDescription, 0);
      await operation();
      notify();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (toastId) {
        view.deleteMessage(toastId);
      }
      view.setIsLoading(false);
    }
  }

  protected updateButtonStatus(
    validationCheck: () => boolean,
    view: { setIsButtonDisabled: (isDisabled: boolean) => void }
  ): void {
    view.setIsButtonDisabled(validationCheck());
  }
}
