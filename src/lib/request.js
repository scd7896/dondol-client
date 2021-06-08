import * as qs from "qs";
import axios from "axios";
import { getCookie } from "./cookie";

const preRequestSet = (config) => {
	config.headers.common["Authorization"] = `${getCookie("token")}`;
	return config;
};

const preErrorSet = (err) => {
	return Promise.reject(err);
};

const responseHandle = (res) => res;
const errorHandle = (err) => {
	if (err.response.data.message) {
		alert(err.response.data.message);
	}
	return Promise.reject(err);
};

class RequestObject {
	static _instance;
	client;
	constructor() {
		this.client = axios.create({
			baseURL:
				process.env.NODE_ENV === "production"
					? "http://ec2-15-165-114-69.ap-northeast-2.compute.amazonaws.com"
					: "http://localhost:9100",
		});
		this.client.interceptors.request.use(preRequestSet, preErrorSet);
		this.client.interceptors.response.use(responseHandle, errorHandle);
	}
	static get Instance() {
		return this._instance || (this._instance = new this());
	}

	get(url, query) {
		return this.client.get(`${url}?${qs.stringify(query)}`);
	}

	post(url, { body, query }) {
		return this.client.post(`${url}?${qs.stringify(query)}`, body);
	}

	delete(url, query) {
		return this.client.delete(`${url}?${qs.stringify(query)}`);
	}

	put(url, { body, query }) {
		return this.client.put(`${url}?${qs.stringify(query)}`, body);
	}

	patch(url, { body, query }) {
		return this.client.patch(`${url}?${qs.stringify(query)}`, body);
	}
}

export default RequestObject.Instance;
