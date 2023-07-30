import http from '@/plugin/https';
import kelasService from "@/services/kelas.service";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Form, Input, Layout, Modal, Row, Select, Space, Table, Typography, message } from "antd";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from 'sweetalert2';

Kelas.layout = "L1";

export default function Kelas({ kelas }) {
    const [form] = Form.useForm()
    const router = useRouter()

    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [id, setId] = useState(null)
    let data = []

    const handleClose = () => {
        setOpen(false)
        form.resetFields()
        setIsEdit(false)
        setId(null)
    }

    const searchInput = useRef(null);

    kelas.data.map(item => data.push({
        key: item._id,
        namaKelas: item.name,
        kelas: item.kelas
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


    const handleEdit = async (id) => {
        setOpen(true)
        setId(id)
        setIsEdit(true)

        try {
            const res = await kelasService.find(id)
            form.setFieldsValue({ name: res.data.name, kelas: res.data.kelas })
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Edit sedang bermasalah, silahkan mencoba kembali"
            })
        }
    }

    const columns = [
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            // width: "300px",
            ...getColumnSearchProps("kelas"),
            // fixed: "left",
        },
        {
            title: "Nama Kelas",
            dataIndex: "namaKelas",
            key: "namaKelas",
        },
        {
            title: "Aksi",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <>
                    <Button type='link' onClick={() => {
                        handleEdit(record.key)
                    }}>
                        Edit
                    </Button>
                    <Button type='link' danger onClick={() => handleDelete(record.key)}>
                        Hapus
                    </Button>
                </>
            )
        }

    ];

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
                const payload = {
                    name: values.name,
                    kelas: values.kelas
                }

                try {
                    if (isEdit) {
                        const res = await kelasService.edit(payload, id)
                    } else {
                        const res = await kelasService.create(payload)
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
                } catch {
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }

    const handleDelete = (id) => {
        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data akan dihapus secara permanen",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await kelasService.delete(id)
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
                } catch {
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: "Data gagal dihapus, mohon coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }

    return (
        <>
            <Head>
                <title>Kelas | Sistem Informasi Mutiara</title>
            </Head>
            <Layout.Content>
                <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Kelas</Typography.Title>
                <div className="mb-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/">Dashboard</Link>,
                            },
                            {
                                title: "Kelas",
                            },
                        ]}
                    />
                    <Space>
                        <Button
                            onClick={() => setOpen(true)}
                            type="primary"
                            icon={<PlusOutlined />}>
                            Tambah
                        </Button>
                    </Space>
                </div>
                <Card title="Data Kelas">
                    <Table
                        sticky
                        bordered
                        size="small"
                        style={{
                            height: "100",
                        }}
                        columns={columns}
                        dataSource={data}
                    />
                </Card>
            </Layout.Content>
            <Modal open={open} title="Form Kelas" onCancel={handleClose} onOk={() => form.submit()}>
                <Card className="m-[20px]">
                    <Form colon={false} layout="vertical" form={form} onFinish={handleSubmit}>
                        <Form.Item label="Kelas" name="kelas" required rules={[{ message: "Mohon isi nama kelas", required: true }]}>
                            <Select placeholder="Mohon pilih kelas" options={[
                                {
                                    label: "7",
                                    value: '7'
                                },
                                {
                                    label: "8",
                                    value: '8'
                                },
                                {
                                    label: "9",
                                    value: '9'
                                },
                            ]} />
                        </Form.Item>
                        <Form.Item label="Nama Kelas" name="name" required rules={[{ message: "Mohon isi nama kelas", required: true }]}>
                            <Input placeholder="Nama Kelas" />
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/kelas')
    const session = await getSession(ctx)

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
            kelas: data,
        },
    };
}
