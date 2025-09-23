import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

import Post from "./Post";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";

export default function StatusItem({
  items,
  featurePath,
}: {
  items: Status[];
  featurePath: string;
}) {
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions()

  const { setDisplayedUser } = useUserInfoActions()
  const { displayedUser: displayedUserAliasParam } = useParams();
  const { displayedUser, authToken } =useUserInfo()
  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);
  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`/feed/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
          <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
              <div className="row mx-0 px-0">
                <div className="col-auto p-3">
                  <img
                    src={item.user.imageUrl}
                    className="img-fluid"
                    width="80"
                    alt="Posting user"
                  />
                </div>
                <div className="col">
                  <h2>
                    <b>
                      {item.user.firstName} {item.user.lastName}
                    </b>{" "}
                    -{" "}
                    <Link
                      to={`/feed/${item.user.alias}`}
                      onClick={navigateToUser}
                    >
                      {item.user.alias}
                    </Link>
                  </h2>
                  {item.formattedDate}
                  <br />
                  <Post status={item} featurePath={featurePath} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
