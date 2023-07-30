import AddDelete from "@/components/AddDelete";
import { SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Popconfirm, Space, Table, Typography } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "postcss";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import http from '@/plugin/https'
import Head from "next/head";

Page.layout = "L1";

export default function Page({ pengumuman }) {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const router = useRouter();
    const data = [];
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    pengumuman?.data.map((item) =>
        data.push({
            key: item._id,
            title: item?.title,
            content: item?.content,
            for: item?.for,
            timeEnd: item?.timeEnd,
            timeStart: item?.timeStart,
        })
    );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}>
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const confirm = (record) => {
        // handleDelete()
        const data = [];
        data.push(record?.nik);
        // console.log("record:", record);
        handleDelete(data, config)
            .then(message.success("Click on Yes"))
            .catch((err) => console.log(err));
    };

    const cancel = (e) => {
        console.log(e);
        message.error("Click on No");
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "300px",
            ...getColumnSearchProps("title"),
            fixed: "left",
        },
        {
            title: "Untuk",
            dataIndex: "for",
            key: "for",
            width: "200px",
            ...getColumnSearchProps("for"),
        },
        {
            title: "Time Start",
            dataIndex: "timeStart",
            key: "timeStart",
            ...getColumnSearchProps("timeStart"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Time End",
            dataIndex: "timeEnd",
            key: "timeEnd",
            ...getColumnSearchProps("timeEnd"),
            width: "200px",
        },

        {
            title: "Edit",
            dataIndex: "edit",
            fixed: "right",
            width: "200px",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Yakin ingin menghapus?"
                        onConfirm={() => confirm(record)}
                        onCancel={cancel}>
                        <Button
                            type="primary"
                            danger>
                            Delete
                        </Button>
                    </Popconfirm>
                    <Button
                        type="primary"
                        onClick={() => router.push("/pengumuman/tambah")}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
            setSelectedRow(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const [selectedRow, setSelectedRow] = useState([]);

    return (
        <>
            <Head>
                <title>Pengumuman | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Pengumuman</Typography.Title>
            <div className="mb-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: "Pengumuman",
                        },
                    ]}
                />
            </div>
            <Card title="Data Pengumuman">
                <Table
                    sticky
                    bordered
                    size="small"
                    // rowSelection={{
                    //     type: "checkbox",
                    //     ...rowSelection,
                    // }}
                    // style={{
                    //     height: "100",
                    // }}
                    columns={columns}
                    dataSource={data}
                    scroll={{
                        x: 1200,
                    }}
                />
            </Card>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/admin/pengumuman')
    // if (!session) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/login",
    //         },
    //         props: {},
    //     };
    // }

    return {
        props: {
            pengumuman: data,
        },
    };
}

