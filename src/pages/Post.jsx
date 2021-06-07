import { Layout, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import ContentsModal from "../component/ContentsModal";
import request from "../lib/request";
import Template from "../templates/Template";
const { Content } = Layout;
const postColumns = [
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
];
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
			},
		[requestPosts]
	);

	const onPageChange = useCallback((nextPage) => {
		setPage(nextPage);
	}, []);

	useEffect(() => {
		requestPosts(page);
	}, [requestPosts, page]);

	return (
		<Template>
			<Content style={{ minHeight: "100vh" }}>
				{isModalOpen && targetId && (
					<ContentsModal
						targetId={targetId}
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
