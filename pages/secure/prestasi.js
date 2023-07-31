import http from '@/plugin/https';
import prestasiService from "@/services/prestasi.service";
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Input, Popconfirm, Space, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";


Prestasi.layout = "L1";

const { Meta } = Card;

export default function Prestasi({ kelas, prestasi }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);

    const searchInput = useRef(null);
    const data = [];
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    kelas?.data.map((item) =>
        data.push({
            key: item._id,
            name: item?.name,
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

    const confirm = async (record) => {
        console.log(record);
        try {
            setLoadingFirst(true);
            const res = await prestasiService.delete(record);
            message.success(res?.message);
            push(asPath);
        } catch (err) {
            message.error(err?.message);
        } finally {
            setLoadingFirst(false);
        }
    };

    return (
        <>
            <Head>
                <title>Prestasi | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2}>Data Prestasi</Typography.Title>
                <div className="my-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/secure/dashboard">Dashboard</Link>,
                            },
                            {
                                title: "Prestasi",
                            },
                        ]}
                    />
                    <Link
                        href={{
                            pathname: "/prestasi/tambah",
                        }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}>
                            Tambah
                        </Button>
                    </Link>
                </div>
                {/* <Input style={{ width: 300, marginBottom: 20 }} /> */}
                <div className="grid grid-cols-4 gap-5">
                    {prestasi?.data?.map((item) => (
                        <Card
                            className="shadow"
                            cover={
                                <img
                                    alt={item?.siswa?.name}
                                    src={item?.img}
                                    height={250}
                                />
                            }
                            actions={[
                                <Link
                                    target="_blank"
                                    href={{
                                        pathname: item?.sertifikat,
                                    }}>
                                    <DownloadOutlined key="setting" />
                                </Link>,
                                <EditOutlined
                                    key="edit"
                                    onClick={() => push(`/prestasi/${item?._id}`)}
                                />,
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={() => confirm(item?._id)}
                                    // onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No">
                                    <DeleteOutlined />
                                </Popconfirm>,
                            ]}>
                            <Meta
                                title={`${item?.deskripsi} (${item?.ekstrakurikuler?.name})`}
                                description={item?.siswa?.name}
                            />
                        </Card>
                    ))}
                </div>
            </>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/kelas')
    const { data: prestasi } = await http.get('/prestasi')
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
            kelas: data,
            prestasi: prestasi
        },
    };
}

