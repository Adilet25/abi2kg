import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { UniversityDetail } from "./pages/UniversityDetail";
import { Profile } from "./pages/Profile";
import { Quiz } from "./pages/Quiz";
import { Rankings } from "./pages/Rankings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "university/:id", Component: UniversityDetail },
      { path: "profile", Component: Profile },
      { path: "quiz", Component: Quiz },
      { path: "rankings", Component: Rankings },
    ],
  },
]);