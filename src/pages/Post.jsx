import { Button, Layout, Table } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContentsModal from "../component/ContentsModal";
import CreateModal from "../component/CreateModal";
import request from "../lib/request";
import Template from "../templates/Template";
import styles from "./Post.module.css";

const { Content } = Layout;

export default function Post() {
	const [posts, setPosts] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [targetId, setTargetId] = useState();

	const requestPosts = useCallback(async (page = 1) => {
		const {
			data: { payload, count },
		} = await request.get("/post", { size: 30, number: page });
		setTotalCount(count);
		setPosts(payload.map((post) => ({ ...post, key: post.id })));
	}, []);

	const rowClickListener = useCallback((arg) => {
		setIsModalOpen(true);
		setTargetId(arg.id);
	}, []);

	const createButtonClickListener = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const modalClickListener = useCallback(
		(isSubmit = false) =>
			() => {
				if (isSubmit) {
					setPage((prev) => {
						if (prev === 1) requestPosts(1);
						return 1;
					});
				}
				setIsModalOpen(false);
				setTargetId(null);
			},
		[requestPosts]
	);

	const onPageChange = useCallback((nextPage) => {
		setPage(nextPage);
	}, []);

	const deleteClickListener = useCallback(
		async ({ id }) => {
			if (window.confirm("정말로 삭제하시겠습니까?")) {
				await request.delete(`/post/${id}`);
				alert("게시물이 삭제되었습니다.");
				requestPosts(page);
			}
		},
		[page, requestPosts]
	);

	const postColumns = useMemo(
		() => [
			{
				title: "제목",
				dataIndex: "title",
				key: "title",
			},
			{
				title: "만난 날짜",
				dataIndex: "meetDate",
				key: "meetDate",
			},
			{
				title: "작성일",
				dataIndex: "createdAt",
				key: "createdAt",
			},
			{
				title: "최종 업데이트",
				dataIndex: "updatedAt",
				key: "updatedAt",
			},
			{
				render: (record) => (
					<Button
						type="primary"
						danger={true}
						onClick={(e) => {
							e.stopPropagation();
							deleteClickListener(record);
						}}
					>
						삭제
					</Button>
				),
			},
		],
		[deleteClickListener]
	);

	useEffect(() => {
		requestPosts(page);
	}, [requestPosts, page]);

	return (
		<Template>
			<Content style={{ minHeight: "100vh" }}>
				<Button className={styles.floatingButton} onClick={createButtonClickListener}>
					게시물쓰기
				</Button>
				{isModalOpen && targetId ? (
					<ContentsModal
						targetId={targetId}
						isOpen={isModalOpen}
						onCloseClick={modalClickListener(false)}
						onSubmitClick={modalClickListener(true)}
					/>
				) : (
					<CreateModal
						isOpen={isModalOpen}
						onCloseClick={modalClickListener(false)}
						onSubmitClick={modalClickListener(true)}
					/>
				)}
				<Table
					dataSource={posts}
					columns={postColumns}
					onRow={(record) => {
						return {
							onClick: () => rowClickListener(record),
						};
					}}
					pagination={{
						total: totalCount,
						pageSize: 30,
						onChange: onPageChange,
						current: page,
					}}
				/>
			</Content>
		</Template>
	);
}
