import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusItemView {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  private _view: StatusItemView;
  protected constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }
  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  public get hasMoreItems(){
    return this._hasMoreItems
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void>;
}
