import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

import Post from "./Post";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useUserNavigation } from "../navigation/NavigationHooks";

export default function StatusItem({
  items,
  featurePath,
}: {
  items: Status[];
  featurePath: string;
}) {
  const { navigateToUser} = useUserNavigation()




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
                      onClick={(e)=>navigateToUser(e, featurePath)}
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
