import { useEffect } from "react";
import "./App.css";
import request from "./lib/request";

function App() {
	useEffect(() => {
		request.get("/post");
	}, []);
	return <div className="App">ddsdsds</div>;
}

export default App;
