import { Layout, Form, Input, Button } from "antd";
import styles from "./Home.module.css";

import Template from "../templates/Template";
import { useCallback } from "react";
import request from "../lib/request";
import { setCookie } from "../lib/cookie";
import { CLIENT_BASE_URL } from "../lib/constants";
import { useHistory } from "react-router";

const { Content } = Layout;

export default function Home() {
	const history = useHistory();
	const onSubmit = useCallback(
		async (arg) => {
			const {
				data: { accessToken },
			} = await request.post("/auth/login", { body: { user: arg } });
			setCookie("token", accessToken);
			history.push(`${CLIENT_BASE_URL}post`);
		},
		[history]
	);

	return (
		<Template>
			<Content className={styles.wrapper}>
				<Form className={styles.form} onFinish={onSubmit}>
					<Form.Item name="email">
						<Input type="email" placeholder="이메일을 입력하세요" />
					</Form.Item>
					<Form.Item name="password">
						<Input type="password" placeholder="비밀번호를 입력하세요" />
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" type="primary">
							로그인
						</Button>
					</Form.Item>
				</Form>
				<div className={styles.imageWrapper}>
					<img
						src="https://static-yapp-helper.s3.ap-northeast-2.amazonaws.com/dondol-public/f8fb2b8561d4e49747ad8450bb77cf0d.png"
						alt="나는 차였어"
					/>
				</div>
			</Content>
		</Template>
	);
}
