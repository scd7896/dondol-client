import { Modal } from "antd";
import React, { useCallback } from "react";
import request from "../lib/request";
import EditForm from "./EditForm";

export default function CreateModal({ isOpen, onCloseClick, onSubmitClick }) {
	const onSubmitListener = useCallback(
		async (arg) => {
			await request.post(`/post`, { body: arg });
			alert("게시물이 생성되었습니다.");
			onSubmitClick();
		},
		[onSubmitClick]
	);
	return (
		<Modal title="게시물 추가" visible={isOpen} footer={null} onCancel={onCloseClick} width="80%">
			<EditForm onSubmit={onSubmitListener} onCancel={onCloseClick} />
		</Modal>
	);
}
