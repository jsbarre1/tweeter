import {  Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/StatusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import {
  StatusItemPresenter,
} from "../../presenter/StatusItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";

interface Props {
  featureUrl: string;
  presenterFactory: (observer: PagedItemView<Status>) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const [items, setItems] = useState<Status[]>([]);
  const { displayErrorMessage } = useMessageActions();

  const { displayedUser, authToken } = useUserInfo();
  const observer: PagedItemView<Status> = {
    addItems: (newItems: Status[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };
  const presenterRef = useRef<StatusItemPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(observer);
  }
  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset()
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias)
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems()}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        <StatusItem items={items} featurePath={props.featureUrl} />
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
