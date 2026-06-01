import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const elem = document.getElementById("root")!;
const hot = (import.meta as any).hot;
const root: Root = hot?.data?.root ?? createRoot(elem);
if (hot) hot.data.root = root;

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
