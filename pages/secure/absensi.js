import AbsenModal from "@/components/modals/AbsenModal";
import NilaiModal from "@/components/modals/NilaiModal";
import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import siswaService from "@/services/siswa.service";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Dropdown, Input, Layout, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

Absensi.layout = "L1";
const { Content } = Layout

export default function Absensi({ siswa, ekstrakurikuler }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const data = [];
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    const [dataPendaftar, setDataPendaftar] = useState(null)
    const [open, setOpen] = useState(false)
    const [openNilai, setOpenNilai] = useState(false)

    // siswa.map(item => data.push({
    //     key: item._id,
    //     name: item.name,
    //     kelas: item?.kelas ? `${item.kelas.kelas} ${item.kelas.name}` : "-",
    //     wajib: item?.nilai?.ekstrakurikulerWajib?.ekstrakurikuler ?? "Belum memilih",
    //     pilihan: item?.nilai?.ekstrakurikulerPilihan?.ekstrakurikuler ?? "Belum memilih",
    // }))

    // ekstrakurikuler?.data.map(
    //     (item) =>
    //         item?.approve &&
    //         data.push({
    //             key: item._id,
    //             name: item?.name,
    //             kehadiran: item?.kehadiran,
    //             pertemuan: item?.pertemuan,
    //             lokasi: item?.lokasi,
    //             waktu: item?.waktu?.map((item) => dayjs(item).format("HH:mm")).join(" - "),
    //             hari: item?.hari?.charAt(0).toUpperCase() + item?.hari?.slice(1),
    //             wajib: item?.wajib === true ? "Wajib" : "Pilihan",
    //         })
    // );

    ekstrakurikuler.filter(item => item.approve === true).map(item => data.push({
        key: item._id,
        name: item.name,
        pendaftar: item.pendaftar.length,
        pengajar: item.pengajar.nama,
        wajib: item.wajib ? "Wajib" : "Pilihan",
    }))

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

    const items = (id) => {
        return [
            {
                label: (
                    <a onClick={e => {
                        e.preventDefault()
                        handleAbsen(id)
                    }}>
                        Absensi
                    </a>
                ),
                key: '0',
            },
            {
                label: (
                    <a onClick={e => {
                        e.preventDefault()
                        handleNilai(id)
                    }}>
                        Nilai
                    </a>
                ),
                key: '1',
            },
        ];
    }

    const columns = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "fit",
            ...getColumnSearchProps("name"),
            // fixed: "left",
            // render: (_, record) => (
            //     <Link
            //         href={{
            //             pathname: `/absensi/${record?.key}`,
            //         }}>
            //         {record?.name}
            //     </Link>
            // ),
        },
        {
            title: "Pengajar",
            dataIndex: 'pengajar',
            key: "pengajar"
        },
        {
            title: "Pendaftar",
            dataIndex: "pendaftar",
            key: "pendaftar"
        },
        {
            title: "Tipe",
            dataIndex: "wajib",
            key: "wajib",
            render: (_, record) => (
                <Tag color={record.wajib === "Wajib" ? "yellow" : "green"}>
                    {record.wajib}
                </Tag>
            )
        },
        {
            title: "Aksi",
            fixed: "right",
            width: "100px",
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: items(record.key)
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Aksi
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            )
        }
        // {
        //     title: "Jumlah Pertemuan",
        //     dataIndex: "kehadiran",
        //     key: "kehadiran",
        //     // width: "10px",
        //     ...getColumnSearchProps("kehadiran"),
        // },
        // {
        //     title: "Lokasi",
        //     dataIndex: "lokasi",
        //     key: "lokasi",
        //     ...getColumnSearchProps("lokasi"),
        //     sortDirections: ["descend", "ascend"],
        // },
        // {
        //     title: "Waktu",
        //     dataIndex: "waktu",
        //     key: "waktu",
        //     ...getColumnSearchProps("waktu"),
        // },
        // {
        //     title: "Hari",
        //     dataIndex: "hari",
        //     key: "hari",
        //     ...getColumnSearchProps("hari"),
        // },
        // {
        //     title: "Status",
        //     dataIndex: "wajib",
        //     key: "wajib",
        //     ...getColumnSearchProps("wajib"),
        //     sortDirections: ["descend", "ascend"],
        //     render: (_, record) => <div className={`w-fit ${record?.wajib === "Wajib" ? "bg-green-300" : "bg-yellow-300"} rounded px-5 py-1 `}>{record?.wajib}</div>,
        // },
    ];

    const handleAbsen = async (id) => {
        try {
            const res = await ekstrakurikulerService.find(id)
            setDataPendaftar(res.data)
            setOpen(true)
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleNilai = async (id) => {
        try {
            const res = await ekstrakurikulerService.find(id)

            setDataPendaftar(res.data)
            setOpenNilai(true)
        } catch (err) {
            console.log(err);
        }
    }

    const handleClose = () => {
        setOpen(false)
        setOpenNilai(false)
    }

    return (
        <>
            <Head>
                <title>Absensi | Sistem Informasi Mutiara</title>
            </Head>
            <Content>
                <Typography.Title
                    level={2}
                    style={{ margin: "0", padding: 0 }}>
                    Absensi
                </Typography.Title>
                <div className="mb-5 flex items-center justify-between">
                    <Breadcrumb style={{ margin: "0 0 16px" }} items={[
                        {
                            title: <Link href={{
                                pathname: "/secure/dashboard"
                            }}>Dashboard</Link>
                        },
                        {
                            title: "Absensi"
                        }
                    ]} />
                </div>
                <Card title="Data Absensi">
                    <Table
                        bordered
                        size="small"
                        // rowSelection={{
                        //     type: "checkbox",
                        //     ...rowSelection,
                        // }}
                        // style={{
                        //     height: "100",
                        //     marginTop: 10,
                        // }}
                        columns={columns}
                        dataSource={data}
                    // scroll={{
                    //     x: "fit",
                    // }}
                    />
                </Card>

                <AbsenModal open={open} onCancel={handleClose} data={dataPendaftar} />
                <NilaiModal open={openNilai} onCancel={handleClose} data={dataPendaftar} setDataPendaftar={setDataPendaftar} />
            </Content>

        </>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    const { data: siswa } = await siswaService.get()
    const { data: ekstrakurikuler } = await ekstrakurikulerService.get()

    if (!session) {
        return {
            redirect: {
                destination: "/login",
            },
            props: {},
        };
    }

    return {
        props: {
            ekstrakurikuler: ekstrakurikuler,
            siswa: siswa
        },
    };
}
