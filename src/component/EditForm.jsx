import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Editor from "./Editor";
import request from "../lib/request";
import Modal from "antd/lib/modal/Modal";
function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
/**
 * 
 			{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }
 */
export default function EditForm({
	defaultContent = "",
	defaultTitle = "",
	defaultMeetDate = "",
	defaultImages = [],
	onSubmit,
	onCancel,
}) {
	const [content, setContent] = useState(defaultContent);
	const [prevData, setPrevData] = useState({ isOpen: false, title: "", previewImage: "" });
	const [fileList, setFileList] = useState(defaultImages);
	const inputRef = useRef(null);
	const meetDateRef = useRef(null);

	const handlePreview = useCallback(async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setPrevData({
			previewImage: file.url || file.preview,
			isOpen: true,
			title: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
		});
	}, []);

	const onAction = useCallback(async (file) => {
		const url = URL.createObjectURL(file);
		console.log(url);
		return url;
	}, []);

	const handleChange = useCallback(
		({ fileList }) => setFileList(fileList.map((file) => ({ ...file, status: "done" }))),
		[]
	);

	const preUpload = useCallback(async () => {
		const formData = new FormData();
		fileList.filter((file) => file.originFileObj).map(({ originFileObj }) => formData.append("files", originFileObj));
		const { data } = await request.post("/upload", { body: formData });
		return data;
	}, [fileList]);

	const submitUpload = useCallback(async () => {
		const images = await preUpload();
		onSubmit({
			title: inputRef.current.state.value,
			meetDate: meetDateRef.current.state.value,
			contents: content,
			images,
		});
	}, [preUpload, onSubmit, content]);

	return (
		<div>
			<Modal
				visible={prevData.isOpen}
				title={prevData.title}
				footer={null}
				onCancel={() => setPrevData({ isOpen: false, title: "", previewImage: "" })}
			>
				<img alt="example" style={{ width: "100%" }} src={prevData.previewImage} />
			</Modal>
			<div>
				<Input placeholder="제목을 입력하세요" ref={inputRef} defaultValue={defaultTitle} name="title" />
			</div>
			<div>
				<Input placeholder="만날 날을 입력하세요" ref={meetDateRef} defaultValue={defaultMeetDate} name="meetDate" />
			</div>
			<Upload
				listType="picture-card"
				action={onAction}
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
			>
				<div>
					<PlusOutlined />
					<div style={{ marginTop: 8 }}>Upload</div>
				</div>
			</Upload>

			<Editor value={content} setValue={setContent} name="content" />
			<div>
				<Button type="primary" onClick={submitUpload}>
					확인
				</Button>
				<Button type="default" onClick={onCancel}>
					취소
				</Button>
			</div>
		</div>
	);
}
