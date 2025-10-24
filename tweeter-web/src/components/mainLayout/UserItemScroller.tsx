import { useEffect, useRef } from "react";
import { User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import ItemScroller from "./ItemScroller";
import { FollowService } from "../../model.service/FollowService";

interface Props {
  featureUrl: string;
  presenterFactory: (observer: PagedItemView<User>) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const presenterRef = useRef<UserItemPresenter | null>(null);

  // Update the displayed user context variable whenever the displayedUser url parameter changes.
  // This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias &&
      presenterRef.current
    ) {
      presenterRef.current.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  return (
    <ItemScroller<User, FollowService>
      presenterFactory={(observer) => {
        const presenter = props.presenterFactory(observer);
        presenterRef.current = presenter;
        return presenter;
      }}
      renderItems={(items) =>
        <>
          {items.map((item, index) => (
            <div
              key={index}
              className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
              <UserItem user={item} featurePath={props.featureUrl} />
            </div>
          ))}
        </>
      }
    />
  );
};

export default UserItemScroller;
