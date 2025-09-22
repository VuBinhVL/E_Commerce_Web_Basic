import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { StoreProvider } from "./app/context/StoreContext.tsx";
import "./app/layout/styles.css";
import { router } from "./app/router/Routes.tsx";
import { store } from "./app/store/configureStore.ts";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StoreProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StoreProvider>
);
