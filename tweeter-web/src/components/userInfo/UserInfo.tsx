import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import userInfoHook from "./UserInfoHook";
import { FollowerStatusPresenter, FollowerStatusView } from "../../presenters/FollowerStatusPresenter";
import { FolloweeCountPresenter, FolloweeCountView } from "../../presenters/FolloweeCountPresenter";
import { FollowerCountPresenter, FollowerCountView } from "../../presenters/FollowerCountPresenter";
import { FollowDisplayedUserPresenter } from "../../presenters/FollowDisplayedUserPresenter";
import { UnfollowDisplayedUserPresenter } from "../../presenters/UnfollowDisplayedUserPresenter";
import { DisplayedUserView } from "../../presenters/DisplayUserPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    userInfoHook();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    followerStatusPresenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    followeeCountPresenter.setNumbFollowees(authToken!, displayedUser!);
    followerCountPresenter.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const followerStatusListener: FollowerStatusView = {
    setIsFollower: setIsFollower,
    displayErrorMessage: displayErrorMessage
  }
  const followerStatusPresenter = new FollowerStatusPresenter(followerStatusListener);

  const followeeCountListener: FolloweeCountView = {
    setFolloweeCount: setFolloweeCount,
    displayErrorMessage: displayErrorMessage
  }
  const followeeCountPresenter = new FolloweeCountPresenter(followeeCountListener);

  const followerCountListener: FollowerCountView = {
    setFollowerCount: setFollowerCount,
    displayErrorMessage: displayErrorMessage
  }
  const followerCountPresenter = new FollowerCountPresenter(followerCountListener);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const displayedUserListener: DisplayedUserView = {
    setIsLoading: setIsLoading,
    displayInfoMessage: displayInfoMessage,
    setIsFollower: setIsFollower,
    setFollowerCount: setFollowerCount,
    setFolloweeCount: setFolloweeCount,
    displayErrorMessage: displayErrorMessage,
    clearLastInfoMessage: clearLastInfoMessage
  }
  const followDisplayedUserPresenter = new FollowDisplayedUserPresenter(displayedUserListener);
  const unfollowDisplayedUserPresenter = new UnfollowDisplayedUserPresenter(displayedUserListener);

  return (
    <div className={isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => unfollowDisplayedUserPresenter.updateDisplayedUser(event, authToken, displayedUser)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => followDisplayedUserPresenter.updateDisplayedUser(event, authToken, displayedUser)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
