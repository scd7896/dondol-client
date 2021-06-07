import { Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import request from "../lib/request";
import EditForm from "./EditForm";

export default function ContentsModal({ isOpen, onCloseClick, onSubmitClick, targetId }) {
	const [post, setPost] = useState({});
	const [isChangeMode, setIsChangeMode] = useState(false);
	const requestPostDetail = useCallback(async (id) => {
		const { data } = await request.get(`/post/${id}`);
		setPost(data);
	}, []);

	const onSubmitListener = useCallback(
		async (arg) => {
			const data = await request.post("/post", { body: arg });
			onSubmitClick();
		},
		[onSubmitClick]
	);

	useEffect(() => {
		requestPostDetail(targetId);
	}, [targetId, requestPostDetail]);

	return (
		<Modal title={post.title} visible={isOpen} onOk={onSubmitClick} onCancel={onCloseClick} footer={null}>
			<EditForm onSubmit={onSubmitListener} onCancel={onCloseClick} />
		</Modal>
	);
}
