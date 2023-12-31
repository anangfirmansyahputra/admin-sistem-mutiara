import { SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Space, Table } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "postcss";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import http from '@/plugin/https';

Pendaftar.layout = "L1";

export default function Pendaftar({ ekstrakurikuler }) {
    const { query } = useRouter();

    const ekstra = ekstrakurikuler?.data?.find((item) => item?._id === query.id);
    const isWajib = ekstra?.wajib

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const data = [];
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    ekstra?.pendaftar?.map((item) =>
        data.push({
            key: item?._id,
            nis: item?.nis,
            name: item?.name,
            nilai: isWajib ? item?.nilai?.ekstrakurikulerWajib?.nilai : item?.nilai?.ekstrakurikulerPilihan?.nilai,
            absen: isWajib ? item?.nilai?.ekstrakurikulerWajib?.absen : item?.nilai?.ekstrakurikulerPilihan?.absen,
        })
    );

    console.log(data);

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

    const columns = [
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            width: "fit",
            ...getColumnSearchProps("nis"),
            // fixed: "left",
        },
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            // width: "10px",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Absensi",
            dataIndex: "absen",
            key: "absens",
            ...getColumnSearchProps("absen"),
        },
        {
            title: "Nilai",
            dataIndex: "nilai",
            key: "nilai",
            ...getColumnSearchProps("nilai"),
        },
    ];

    return (
        <div>
            <div className="my-[25px] flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: <Link href="/ekstrakurikuler">Ektrakurikuler</Link>,
                        },
                        {
                            title: ekstra?.nama,
                        },
                    ]}
                />
            </div>
            <Card>
                <Table
                    bordered
                    size="large"
                    style={{
                        height: "100",
                        marginTop: 10,
                    }}
                    columns={columns}
                    dataSource={data}
                    scroll={{
                        x: "fit",
                    }}
                />
            </Card>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const { data: ekstrakurikuler } = await http.get('/pengajar/ekstrakurikuler')
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
            ekstrakurikuler: ekstrakurikuler
        },
    };
}
