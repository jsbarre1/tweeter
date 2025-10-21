import { useState, useEffect, useRef, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PagedItemView, PagedItemPresenter } from "../../presenter/PagedItemPresenter";
import { Service } from "../../model.service/Serivce";

interface Props<T, U extends Service> {
  presenterFactory: (observer: PagedItemView<T>) => PagedItemPresenter<T, U>;
  renderItems: (items: T[]) => ReactNode;
}

function ItemScroller<T, U extends Service>(props: Props<T, U>) {
  const [items, setItems] = useState<T[]>([]);
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();

  const observer: PagedItemView<T> = {
    addItems: (newItems: T[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<PagedItemPresenter<T, U> | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(observer);
  }

  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
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
        {props.renderItems(items)}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
