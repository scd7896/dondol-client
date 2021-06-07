import React from "react";
import { Layout } from "antd";
const { Header, Footer } = Layout;
export default function Template({ children }) {
	return (
		<Layout>
			<Header>
				<h1 style={{ color: "#ffffff", fontWeight: "bold" }}>돈추니의 연애를 응원합니다</h1>
			</Header>
			{children}
			<Footer>김서버가 만들었다. 모든 저작권은 김서버한테 있음</Footer>
		</Layout>
	);
}
