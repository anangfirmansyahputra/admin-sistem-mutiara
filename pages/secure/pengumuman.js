import http from '@/plugin/https';
import pengumumanService from '@/services/pengumuman.service';
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Form, Modal, Popconfirm, Row, Space, Table, Typography, Input, Select, DatePicker } from "antd";
import dayjs from 'dayjs';
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from 'sweetalert2';

Page.layout = "L1";

export default function Page({ pengumuman }) {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const router = useRouter();
    const data = [];
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const [form] = Form.useForm()

    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [id, setId] = useState(null)


    pengumuman?.data.map((item) =>
        data.push({
            key: item._id,
            title: item?.title,
            content: item?.content,
            for: item?.for,
            timeEnd: dayjs(item?.timeEnd).format('YYYY-MM-DD'),
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
            // width: "300px",
            ...getColumnSearchProps("title"),
            // fixed: "left",
        },
        {
            title: "Ditujukan Kepada",
            dataIndex: "for",
            key: "for",
            // width: "200px",
            ...getColumnSearchProps("for"),
            render: (_, record) => (
                <span className='capitalize'>{record.for}</span>
            )
        },
        // {
        //     title: "Time Start",
        //     dataIndex: "timeStart",
        //     key: "timeStart",
        //     ...getColumnSearchProps("timeStart"),
        //     sortDirections: ["descend", "ascend"],
        //     width: "200px",
        // },
        {
            title: "Waktu",
            dataIndex: "timeEnd",
            key: "timeEnd",
            ...getColumnSearchProps("timeEnd"),
            // width: "200px",
        },
        // {
        //     title: "Edit",
        //     dataIndex: "edit",
        //     fixed: "right",
        //     width: "100px",
        //     render: (_, record) => (
        //         <Space>
        //             <Popconfirm
        //                 title="Yakin ingin menghapus?"
        //                 onConfirm={() => confirm(record)}
        //                 onCancel={cancel}>
        //                 <Button
        //                     type="primary"
        //                     danger>
        //                     Delete
        //                 </Button>
        //             </Popconfirm>
        //             <Button
        //                 type="primary"
        //                 onClick={() => router.push("/pengumuman/tambah")}>
        //                 Edit
        //             </Button>
        //         </Space>
        //     ),
        // },
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
                        const res = await pengumumanService.update(id, values)
                    } else {
                        const res = await pengumumanService.create(values)
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

    const handleClose = () => {
        setOpen(false)
        form.resetFields()
        setIsEdit(false)
        setId(null)
    }

    const handleEdit = async (id) => {
        setOpen(true)
        setId(id)
        setIsEdit(true)

        try {
            const res = await pengumumanService.find(id)
            form.setFieldsValue({ ...res.data, timeEnd: dayjs(res.data.timeEnd) })
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Edit sedang bermasalah, silahkan mencoba kembali"
            })
        }
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
                    const res = await pengumumanService.delete(id)
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
                <title>Pengumuman | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Pengumuman</Typography.Title>
            <div className="mb-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/secure/dashboard">Dashboard</Link>,
                        },
                        {
                            title: "Pengumuman",
                        },
                    ]}
                />
                <Button onClick={() => setOpen(true)} type="primary" icon={<PlusOutlined />}>Pengumuman</Button>
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
                // scroll={{
                //     x: 1200,
                // }}
                />
            </Card>
            <Modal open={open} title="Form Pengumuman" width={1200} onCancel={handleClose} onOk={() => form.submit()}>
                <Card className="m-[20px]">
                    <Form labelWrap labelCol={{ span: 6 }} colon={false} form={form} onFinish={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Judul" name="title" required rules={[{ message: "Mohon isi judul", required: true }]}>
                                    <Input placeholder='Judul' />
                                </Form.Item>
                                <Form.Item label="Deskripsi" name="content" required rules={[{ message: "Mohon isi deskripsi", required: true }]}>
                                    <Input.TextArea placeholder='Deskripsi' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ditujukan Kepada" name="for" required rules={[{ message: "Mohon pilih untuk", required: true }]}>
                                    <Select options={[
                                        {
                                            label: "Siswa",
                                            value: "siswa"
                                        },
                                        {
                                            label: "Pengajar",
                                            value: "pengajar"
                                        },
                                        {
                                            label: "Semua",
                                            value: "semua"
                                        },
                                    ]} placeholder="Untuk" />
                                </Form.Item>
                                <Form.Item label="Waktu" name="timeEnd" required rules={[{ message: "Mohon isi waktu berakhir", required: true }]}>
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Modal>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.post('/admin/pengumuman/all')
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

