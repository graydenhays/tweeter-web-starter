import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import userInfoHook from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { AuthView } from "./presenters/Presenter";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";

const App = () => {
  const { currentUser, authToken } = userInfoHook();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={1}
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
              itemComponent={(value: Status) => <StatusItem status={value}/>}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={2}
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
              itemComponent={(value: Status) => <StatusItem status={value}/>}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
              itemComponent={(value: User) => <UserItem value={value}/>}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4}
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
              itemComponent={(value: User) => <UserItem value={value}/>}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: AuthView) => new LoginPresenter(view)}
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <Login
            originalUrl={location.pathname}
            presenterGenerator={(view: AuthView) => new LoginPresenter(view)}
          />
        }
      />
    </Routes>
  );
};

export default App;
