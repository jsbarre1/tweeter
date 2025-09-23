import { useContext } from "react";
import {
  UserInfoContext,
  
} from "../userInfo/UserInfoContexts";
import { AuthToken, FakeData, Status} from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";
import StatusItem from "../statusItem/StatusItem";

export const PAGE_SIZE = 10;

const FeedScroller = () => {
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);
  const { displayToast } = useContext(ToastActionsContext);

  const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const { displayedUser, authToken } = useContext(UserInfoContext);


  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems(null);
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    setLastItem(() => null);
    setHasMoreItems(() => true);
  };

  const loadMoreItems = async (lastItem: Status | null) => {
    try {
      const [newItems, hasMore] = await loadMoreFeedItems(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load feed items because of exception: ${error}`,
        0
      );
    }
  };

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };





  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems(lastItem)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        <StatusItem items={items} featurePath="/feed"/>
       
      </InfiniteScroll>
    </div>
  );
};

export default FeedScroller;
