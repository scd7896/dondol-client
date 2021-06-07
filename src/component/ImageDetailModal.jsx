import { Modal } from "antd";
import React from "react";

export default function ImageDetailModal({ isOpen, title, onCancel, image }) {
	return (
		<Modal visible={isOpen} title={title} footer={null} onCancel={onCancel}>
			<img alt="example" style={{ width: "100%" }} src={image} />
		</Modal>
	);
}
