import { AppProviders } from "./provider/AppProviders";
import router from "./routes/router";
import { RouterProvider } from "react-router-dom";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
