import { Button, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import request from "../lib/request";
import EditForm from "./EditForm";
import ImageDetailModal from "./ImageDetailModal";
import styles from "./ContentModal.module.css";

export default function ContentsModal({ isOpen, onCloseClick, onSubmitClick, targetId }) {
	const [post, setPost] = useState({
		contents: "",
		title: "",
		meetDate: "",
		images: [],
	});
	const [previewData, setPreviewData] = useState({
		isOpen: false,
		title: "",
		previewImage: "",
	});
	const [isChangeMode, setIsChangeMode] = useState(false);
	const requestPostDetail = useCallback(async (id) => {
		const { data } = await request.get(`/post/${id}`);
		setPost(data);
	}, []);

	const onSubmitListener = useCallback(
		async (arg) => {
			await request.put(`/post/${targetId}`, { body: arg });
			alert("게시물이 수정되었습니다.");
			onSubmitClick();
		},
		[onSubmitClick, targetId]
	);

	const imageDetailOpen = useCallback(
		(path) => {
			setPreviewData({
				title: post.title,
				previewImage: path,
				isOpen: true,
			});
		},
		[post.title]
	);

	useEffect(() => {
		requestPostDetail(targetId);
	}, [targetId, requestPostDetail]);

	return (
		<Modal title={post.title} visible={isOpen} onCancel={onCloseClick} footer={null} width="80%">
			{isChangeMode ? (
				<EditForm
					defaultContent={post.contents}
					defaultTitle={post.title}
					defaultMeetDate={post.meetDate}
					defaultImages={post.images.map((image) => ({
						uid: image.id,
						url: image.path,
						status: "done",
						name: post.title,
					}))}
					onSubmit={onSubmitListener}
					onCancel={onCloseClick}
				/>
			) : (
				<div>
					<ImageDetailModal
						isOpen={previewData.isOpen}
						title={previewData.title}
						onCancel={() => setPreviewData({ isOpen: false, title: "", previewImage: "" })}
						image={previewData.previewImage}
					/>
					<div dangerouslySetInnerHTML={{ __html: post.contents }} />
					<div className={styles.imageWrapper}>
						{post.images.map(({ path }) => (
							<img className={styles.image} src={path} onClick={() => imageDetailOpen(path)} alt="예시 이미지" />
						))}
					</div>
					<Button style={{ marginTop: "32px" }} onClick={() => setIsChangeMode(true)}>
						수정모드
					</Button>
				</div>
			)}
		</Modal>
	);
}
