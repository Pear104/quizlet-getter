import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootPath = ".biky2b7";

document.querySelector(rootPath)?.prepend(document.createElement("div"));
ReactDOM.createRoot(document.querySelector(`${rootPath} > div`)!).render(
  <App />
);
