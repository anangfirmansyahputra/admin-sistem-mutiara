import useDeletePengajarContext from "@/context/useDeletePengajarContext";
import http from '@/plugin/https';
import matpelService from "@/services/matpel.service";
import pengajarService from "@/services/pengajar.service";
import { DeleteOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Layout, Modal, Popconfirm, Row, Select, Space, Table, Typography, message } from "antd";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

Pengajar.layout = "L1";
const { Content } = Layout

export default function Pengajar({ pengajar, matpel }) {
    const [form] = Form.useForm()
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const router = useRouter()


    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    // const { handleDelete, loading } = useDeletePengajarContext();
    const searchInput = useRef(null);
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [id, setId] = useState(null)

    const data = [];

    const token = session?.user?.user?.accessToken;
    pengajar?.data.map((item) =>
        data.push({
            key: item._id,
            nama: item?.nama,
            nik: item?.nik,
            mengajar: item?.mengajar,
            ekstrakurikuler: item?.ekstrakurikuler,
            alamat: item?.alamat,
            tgl: item?.tgl,
            noTelp: item?.noTelp,
        })
    );

    useEffect(() => {
        setLoadingFirst(false);
    }, []);

    const handleCancel = () => {
        setOpen(false)
        setId(null)
        setIsEdit(false)
        form.resetFields()
    }

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
        try {
            setLoadingFirst(true);
            const deleteRes = await pengajarService.delete(selectedRow?.map((item) => item?.nik));
            message.success(deleteRes?.message);
            push(asPath);
        } catch (err) {
            message.error(err);
        } finally {
            setLoadingFirst(false);
        }
    };

    const columns = [
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
            width: "300px",
            ...getColumnSearchProps("nama"),
            // fixed: "left",
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/pengajar/${record?.nik}`,
                    }}>
                    {record?.nama}
                </Link>
            ),
        },
        {
            title: "NIK",
            dataIndex: "nik",
            key: "nik",
            width: "200px",
            ...getColumnSearchProps("nik"),
        },
        {
            title: "Mengajar",
            dataIndex: "mengajar",
            key: "mengajar",
            ...getColumnSearchProps("mengajar"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Ekstrakurikuler",
            dataIndex: "ekstrakurikuler",
            key: "ekstrakurikuler",
            ...getColumnSearchProps("ekstrakurikuler"),
            width: "200px",
            render: (_, record) => <span>{record?.ekstrakurikuler?.length > 0 ? record?.ekstrakurikuler?.map((item) => item?.name).join(", ") : "-"}</span>,
        },
        {
            title: "Alamat",
            dataIndex: "alamat",
            key: "alamat",
            ...getColumnSearchProps("alamat"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Tanggal Lahir",
            dataIndex: "tgl",
            key: "tgl",
            ...getColumnSearchProps("tgl"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
            render: (_, record) => <span>{dayjs(record?.tgl).format("DD/MM/YYYY")}</span>,
        },
        {
            title: "No Telp",
            dataIndex: "noTelp",
            key: "noTelp",
            ...getColumnSearchProps("noTelp"),
            sortDirections: ["descend", "ascend"],
            width: "200px",
        },
        {
            title: "Aksi",
            fixed: "right",
            width: "150px",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record.key)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.key)}>Hapus</Button>
                </>
            )
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
        }),
    };

    const [selectedRow, setSelectedRow] = useState([]);

    const handleSubmit = (values) => {
        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: isEdit ? "Data akan dirubah" : "Data akan disimpan",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (isEdit) {
                        const res = await pengajarService.update(id, values)
                    } else {
                        const res = await pengajarService.create(values)
                    }
                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: isEdit ? "Data berhasil diupdate" : "Data berhasil disimpan"
                    })
                    router.push(router.asPath)
                    setOpen(false)
                    form.resetFields()
                    setId(null)
                    setIsEdit(false)
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON?.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                        // text: "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }

    const handleEdit = async (id) => {
        try {
            setIsEdit(true)
            setOpen(true)
            setId(id)
            const { data } = await pengajarService.find(id)
            const formattedDate = dayjs(data.tgl).format("YYYY-MM-DD");
            form.setFieldsValue({ ...data, tgl: dayjs(formattedDate) });

        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: "Gagal",
                text: "Server sedang mengalami gangguan, silahkan coba kembali"
            })
        }
    }

    const handleDelete = async (id) => {
        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data akan dihapus permanen",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await pengajarService.deleteOne(id)
                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil dihapus"
                    })
                    router.push(router.asPath)
                    setOpen(false)
                    form.resetFields()
                    setId(null)
                    setIsEdit(false)
                } catch (err) {
                    console.log(err);
                    // const messageErr = JSON.parse(err?.request?.response)?.message
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: "Gagal",
                    //     text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    // })
                }
            } else if (result.isDenied) {
            }
        }
        )
    }




    return (
        <>
            <Head>
                <title>Pengajar | Sistem Informasi Mutiara</title>
            </Head>
            <Content>
                <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Pengajar</Typography.Title>
                <div className="mb-5 flex items-center justify-between">
                    <Breadcrumb items={[
                        {
                            title: <Link href={{
                                pathname: "/dashboard"
                            }}>Dashboard</Link>
                        },
                        {
                            title: "Pengajar"
                        }
                    ]} />

                    <Button
                        onClick={() => setOpen(true)}
                        type="primary"
                        icon={<PlusOutlined />}>
                        Pengajar
                    </Button>
                </div>
                <Card title="Data Pengajar">
                    <Table
                        loading={loadingFirst}
                        sticky
                        bordered
                        size="small"
                        style={{
                            height: "100",
                        }}
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: 1200,
                        }}
                    />
                </Card>
                <Modal open={open} width={1200} footer={<Button icon={<SaveOutlined />} type="primary" onClick={() => form.submit()}>Submit</Button>} onCancel={handleCancel} title="Form Pengajar" >
                    <Card className="m-[20px]">
                        <Form labelAlign="left" onFinish={handleSubmit} form={form} labelCol={{ span: 6 }} colon={false}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Nama" name="nama" required rules={[
                                        {
                                            message: "Mohon isi nama",
                                            required: true
                                        }
                                    ]}>
                                        <Input placeholder="Nama" />
                                    </Form.Item>
                                    <Form.Item label="Password" name="password" required rules={[
                                        {
                                            message: "Mohon isi password",
                                            required: true
                                        }
                                    ]}>
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                    <Form.Item label="Alamat" name="alamat" required rules={[
                                        {
                                            message: "Mohon isi alamat",
                                            required: true
                                        }
                                    ]}>
                                        <Input placeholder="Alamat" />
                                    </Form.Item>
                                    <Form.Item label="Nomor Telp" name="noTelp" required rules={[
                                        {
                                            message: "Mohon isi nomor telepon",
                                            required: true
                                        }
                                    ]}>
                                        <Input placeholder="Nomor Telepon" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="NIK" name="nik" required rules={[
                                        {
                                            message: "Mohon isi NIK",
                                            required: true
                                        }
                                    ]}>
                                        <Input max={16} placeholder="NIK" />
                                    </Form.Item>
                                    <Form.Item label="Mengajar" name="mengajar" required rules={[
                                        {
                                            message: "Mohon pilih mengajar",
                                            required: true
                                        }
                                    ]}>
                                        <Select placeholder="Mengajar" options={matpel?.map(item => ({
                                            value: item?._id,
                                            label: item?.name
                                        }))} />
                                    </Form.Item>
                                    <Form.Item label="Tanggal Lahir" name="tgl" required rules={[
                                        {
                                            message: "Mohon isi tanggal lahir",
                                            required: true
                                        }
                                    ]}>
                                        <DatePicker style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Modal>
            </Content>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/admin/pengajar')
    const { data: matpel } = await matpelService.get()
    const session = await getSession(ctx)

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
            },
            props: {},
        };
    }

    return {
        props: {
            pengajar: data,
            matpel: matpel
        },
    };
}