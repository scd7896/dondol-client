import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import { CLIENT_BASE_URL } from "./lib/constants";
import Home from "./pages/Home";
import Post from "./pages/Post";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path={`${CLIENT_BASE_URL}post`} component={Post} />
				<Route path={CLIENT_BASE_URL} component={Home} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
