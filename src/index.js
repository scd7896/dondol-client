import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "antd/dist/antd.css";

ReactDom.render(<App />, document.getElementById("root"));
