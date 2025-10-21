import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View{
  addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    super(view)
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
