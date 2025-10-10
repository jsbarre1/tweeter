import { User, AuthToken, FakeData } from "tweeter-shared";
import { Buffer } from "buffer";

export interface RegisterView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigateToPath: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsButtonDisabled: (isDisabled: boolean) => void;
  setImageUrl: (url: string) => void;
}

export class RegisterPresenter {
  private _firstName = "";
  private _lastName = "";
  private _alias = "";
  private _password = "";
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageUrl = "";
  private _imageFileExtension = "";
  private _rememberMe = false;
  private view: RegisterView;

  public constructor(view: RegisterView) {
    this.view = view;
  }

  private updateButtonStatus(): void {
    const isDisabled =
      !this._firstName ||
      !this._lastName ||
      !this._alias ||
      !this._password ||
      !this._imageUrl ||
      !this._imageFileExtension;
    this.view.setIsButtonDisabled(isDisabled);
  }

  public checkSubmitButtonStatus = (): boolean => {
    return (
      !this._firstName ||
      !this._lastName ||
      !this._alias ||
      !this._password ||
      !this._imageUrl ||
      !this._imageFileExtension
    );
  };

  public setFirstName = (value: string) => {
    this._firstName = value;
    this.updateButtonStatus();
  }

  public setLastName = (value: string) => {
    this._lastName = value;
    this.updateButtonStatus();
  }

  public setAlias = (value: string) => {
    this._alias = value;
    this.updateButtonStatus();
  }

  public setPassword = (value: string) => {
    this._password = value;
    this.updateButtonStatus();
  }

  public setRememberMe = (value: boolean) => {
    this._rememberMe = value;
  }

  public handleImageFile(file: File | undefined): void {
    if (file) {
      const url = URL.createObjectURL(file);
      this._imageUrl = url;
      this.view.setImageUrl(url);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._imageBytes = bytes;
        this.updateButtonStatus();
      };
      reader.readAsDataURL(file);

      // Set image file extension
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._imageFileExtension = fileExtension;
        this.updateButtonStatus();
      }
    } else {
      this._imageUrl = "";
      this._imageBytes = new Uint8Array();
      this._imageFileExtension = "";
      this.view.setImageUrl("");
      this.updateButtonStatus();
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public doRegister = async () => {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.register(
        this._firstName,
        this._lastName,
        this._alias,
        this._password,
        this._imageBytes,
        this._imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, this._rememberMe);
      this.view.navigateToPath(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  private async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }
}
