import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootPath = ".biky2b7";

ReactDOM.createRoot(document.querySelector(`${rootPath} > div`)!).render(
  <App />
);
