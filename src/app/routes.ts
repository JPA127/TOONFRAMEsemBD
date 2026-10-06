import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Reviews } from "./components/Reviews";
import { ReviewDetail } from "./components/ReviewDetail";
import { News } from "./components/News";
import { Profile } from "./components/Profile";
import { Login } from "./components/Login";
import { CreateProfile } from "./components/CreateProfile";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/create-profile",
    Component: CreateProfile,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { path: "home", Component: Home },
      { path: "reviews", Component: Reviews },
      { path: "reviews/:id", Component: ReviewDetail },
      { path: "news", Component: News },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
