import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import "./App.css";
import Home from './routes/Home.jsx';
import Error from './routes/Error.jsx';
import Library from './routes/Library.jsx';
import Bookshelf from './routes/Bookshelf.jsx';
import Story from './routes/Story.jsx';
import StoryDetails from './routes/StoryDetails.jsx';
import Login from './routes/Login.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import CreateNovel from './routes/CreateNovel.jsx';
import CreateChapter from './routes/CreateChapter.jsx';
import EditNovel from './routes/EditNovel.jsx';
import UserNovels from './routes/UserNovels.jsx';
import EditChapter from './routes/EditChapter.jsx';
import Logout from './routes/Logout.jsx';
import UserProfile from './routes/UserProfile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "library/:category",
        element: <Library />,
      },
      {
        path: "bookshelf/:category",
        element: (
          <ProtectedRoute>
            <Bookshelf />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile/u/:userId",
        element: <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      },
      {
        path: ":user/all/novels",
        element: (
          <ProtectedRoute>
            <UserNovels />
          </ProtectedRoute>
        ),
      },
      {
        path: ":user/create/novel",
        element: (
          <ProtectedRoute>
            <CreateNovel />
          </ProtectedRoute>
        ),
      },
      {
        path: ":user/create/novel/:storyId/chapter",
        element: (
          <ProtectedRoute>
            <CreateChapter />
          </ProtectedRoute>
        ),
      },
      {
        path: ":user/edit/novel/:storyId/",
        element: (
          <ProtectedRoute>
            <EditNovel />
          </ProtectedRoute>
        ),
      },
      {
        path: ":user/edit/novel/:storyId/chapter/:chapterId",
        element: (
          <ProtectedRoute>
            <EditChapter />
          </ProtectedRoute>
        ),
      },
      {
        path: "about/:storyId",
        element: <StoryDetails />,
      },
      {
        path: "reading/:storyId/:chapterUrl",
        element: (
          <Story />
        ),
      }
    ]
  },
  {
    path: "login",
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: "logout",
    element: <Logout />,
    errorElement: <Error />
  }
]);

ReactDOM.createRoot(document.querySelector("main")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
