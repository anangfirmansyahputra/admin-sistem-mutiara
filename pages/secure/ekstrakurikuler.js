import http from '@/plugin/https';
import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import siswaService from '@/services/siswa.service';
import { DeleteOutlined, DownOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Button, Card, Col, Dropdown, Form, Input, Modal, Popconfirm, Radio, Row, Select, Space, Table, Tag, TimePicker, Typography, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

Ekstrakurikuler.layout = "L1";

export default function Ekstrakurikuler({ ekstrakurikuler, pengajar }) {
    const [form] = Form.useForm()

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [pending, setPending] = useState(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
    const [showPending, setShowPending] = useState(false);
    const data = [];
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [id, setId] = useState(null)

    const handleClose = () => {
        form.resetFields()
        setOpen(false)
        setId(null)
        setIsEdit(false)
    }

    ekstrakurikuler?.data.map(
        (item) =>
            item?.approve &&
            data.push({
                key: item._id,
                name: item?.name,
                pendaftar: item?.pendaftar?.length,
                lokasi: item?.lokasi,
                waktu: item?.waktu?.map((item) => dayjs(item).format("HH:mm")).join(" - "),
                hari: item?.hari?.charAt(0).toUpperCase() + item?.hari?.slice(1),
                wajib: item?.wajib === true ? "Wajib" : "Pilihan",
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

    const handleEdit = async (id) => {
        try {
            setOpen(true)
            setId(id)
            setIsEdit(true)


            const res = await ekstrakurikulerService.find(id)
            const startTime = dayjs(res.data?.waktu[0]);
            const endTime = dayjs(res.data?.waktu[1]);
            form.setFieldsValue({ ...res.data, waktu: [startTime, endTime] });

        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Server sedang error, silahkan coba kembali"
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
                    const res = await ekstrakurikulerService.deleteOne(id)
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
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        }
        )
    }

    const items = (id) => {
        return [
            {
                label: (
                    <a onClick={e => {
                        e.preventDefault()
                    }}>
                        Pendaftar
                    </a>
                ),
                key: '0',
            },
            {
                label: (
                    <a onClick={e => {
                        e.preventDefault()
                        handleEdit(id)
                    }}>
                        Edit
                    </a>
                ),
                key: '1',
            },
            {
                label: (
                    <a onClick={e => {
                        e.preventDefault()
                        handleDelete(id)
                    }}>
                        Delete
                    </a>
                ),
                key: '2',
                danger: true
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
            render: (_, record) => (
                <Link
                    href={{
                        pathname: `/ekstrakurikuler/${record?.key}`,
                    }}>
                    {record?.name}
                </Link>
            ),
        },
        {
            title: "Pendaftar",
            dataIndex: "pendaftar",
            key: "pendaftar",
            // width: "10px",
            ...getColumnSearchProps("pendaftar"),
            render: (_, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => router.push(`/ekstrakurikuler/${record?.key}/pendaftar`)}>
                        {record?.pendaftar}
                    </Button>
                );
            },
        },
        {
            title: "Lokasi",
            dataIndex: "lokasi",
            key: "lokasi",
            ...getColumnSearchProps("lokasi"),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Waktu",
            dataIndex: "waktu",
            key: "waktu",
            ...getColumnSearchProps("waktu"),
        },
        {
            title: "Hari",
            dataIndex: "hari",
            key: "hari",
            ...getColumnSearchProps("hari"),
        },
        {
            title: "Status",
            dataIndex: "wajib",
            key: "wajib",
            ...getColumnSearchProps("wajib"),
            sortDirections: ["descend", "ascend"],
            render: (_, record) => <Tag color={record.wajib === "Wajib" ? "yellow" : "green"}>{record?.wajib}</Tag>,
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
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const [selectedRow, setSelectedRow] = useState([]);

    const handleApprove = async (id) => {
        Swal.fire({
            title: "Yakin ingin meng aprovenya?",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "Iya",
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.put(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/admin/ekstrakurikuler/approve/${id}`);
                    Swal.fire("Berhasil", data?.message, "success").then(() => {
                        setShowPending(false);
                        setPending(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
                        router.push(router.asPath);
                    });
                } catch (err) {
                    Swal.fire("Gagal", err?.data?.message, "error");
                }
            }
        });
    };

    const handleReject = async (id) => {
        const { data } = await axios.delete(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/pengajar/ekstrakurikuler/${id}`);
        message.success("Reject ekstrakurikuler berhasil");
    };

    const confirm = (e) => {
        ekstrakurikulerService.delete(selectedRow?.map((item) => item?.key)).then(() => message.success("Delete success"));
        router.push(router.asPath);
    };

    const handleSubmit = async (values) => {
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
                        const res = await ekstrakurikulerService.update(id, values)
                    } else {
                        const res = await ekstrakurikulerService.create(values)
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
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }

    return (
        <>
            <Head>
                <title>Ekstrakurikuler | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Ekstrakurikuler</Typography.Title>
            <div className="mb-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: "Ekstrakurikuler",
                        },
                    ]}
                />
                <Space>
                    {/* <Link
                        href={{
                            pathname: "/ekstrakurikuler/tambah",
                        }}> */}
                    <Button
                        onClick={() => setOpen(true)}
                        type="primary"
                        icon={<PlusOutlined />}
                        size="middle">
                        Tambah
                    </Button>
                    {/* </Link> */}
                    {selectedRow.length > 0 && (
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={confirm}
                            okText="Yes"
                            cancelText="No">
                            <Button
                                type="default"
                                danger
                                icon={<DeleteOutlined />}
                                size="middle"></Button>
                        </Popconfirm>
                    )}
                </Space>
            </div>
            {pending.length > 0 && (
                <div className='mb-5'>
                    <Alert
                        message="Pemberitahuan"
                        showIcon
                        description={`Ada ${pending?.length} ekstrakurikuler yang belum disetujui`}
                        type="warning"
                        action={
                            <Button
                                onClick={() => router.push("/ekstrakurikuler/approve")}
                                size="small"
                                danger>
                                Detail
                            </Button>
                        }
                    />
                </div>
            )}
            {showPending ? (
                <div className="mt-5 flex flex-col gap-3">
                    {ekstrakurikuler?.data?.map(
                        (item) =>
                            item?.approve === false && (
                                <Alert
                                    message={item?.nama}
                                    description={`Diajukan oleh ${item?.pengajar?.nama}`}
                                    type="info"
                                    action={
                                        <Space direction="vertical">
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={() => handleApprove(item?._id)}>
                                                Approve
                                            </Button>
                                            <Popconfirm
                                                title="Delete the task"
                                                description="Are you sure to delete this task?"
                                                onConfirm={() => handleReject(item?._id)}
                                                onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No">
                                                <Button type="link">Delete</Button>
                                            </Popconfirm>
                                        </Space>
                                    }
                                />
                            )
                    )}
                </div>
            ) : (
                <Card title="Data Ekstrakurikuler">
                    <Table
                        bordered
                        size="small"
                        // rowSelection={{
                        //     type: "checkbox",
                        //     ...rowSelection,
                        // }}
                        style={{
                            height: "100",
                            marginTop: 10,
                        }}
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: 1000,
                        }}
                    />
                </Card>
            )}

            <Modal centered open={open} onCancel={handleClose} title="Form Ekstrakurikuler" width={1200} footer={<Button type='primary' icon={<SaveOutlined />} onClick={() => form.submit()}>Submit</Button>}>
                <Card style={{ margin: 20 }}>
                    <Form form={form} onFinish={handleSubmit} labelAlign='left' colon={false} labelWrap labelCol={{ span: 6 }}>
                        <Row gutter={16}
                        >
                            <Col span={12}>
                                <Form.Item label="Nama Ekstrakurikuler" name="name" required rules={[
                                    {
                                        message: "Mohon isi nama ekstrakurikuler",
                                        required: true
                                    }
                                ]}>
                                    <Input placeholder='Nama Ekstrakurikuler' />
                                </Form.Item>
                                <Form.Item label="Lokasi" name="lokasi" required rules={[
                                    {
                                        message: "Mohon isi lokasi",
                                        required: true
                                    }
                                ]}>
                                    <Input placeholder='Nama Lokasi' />
                                </Form.Item>
                                <Form.Item
                                    required
                                    rules={[
                                        {
                                            message: "Mohon pilih waktu",
                                            required: true
                                        }
                                    ]}
                                    label="Waktu"
                                    name="waktu" >
                                    <TimePicker.RangePicker format="HH:mm" style={{ width: "100%", }} />
                                </Form.Item>
                                <Form.Item
                                    required
                                    rules={[
                                        {
                                            message: "Mohon pilih wajib atau pilihan",
                                            required: true
                                        }
                                    ]}
                                    label="Wajib"
                                    name="wajib">
                                    <Radio.Group buttonStyle='solid' optionType='button'>
                                        <Radio value={true}>Wajib</Radio>
                                        <Radio value={false}>Pilihan</Radio>
                                    </Radio.Group>
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item label="Pengajar" name="pengajar" required rules={[
                                    {
                                        message: "Mohon pilih pengajar",
                                        required: true
                                    }
                                ]}>
                                    <Select placeholder="Pengajar" options={pengajar.data.map(item => ({
                                        value: item._id,
                                        label: item.nama
                                    }))} />
                                </Form.Item>
                                <Form.Item label="Hari" name="hari" required rules={[
                                    {
                                        message: "Mohon pilih hari",
                                        required: true
                                    }
                                ]}>
                                    <Select placeholder="Hari" options={[
                                        {
                                            label: "Senin",
                                            value: "Senin"
                                        },
                                        {
                                            label: "Selasa",
                                            value: "Selasa"
                                        },
                                        {
                                            label: "Rabu",
                                            value: "Rabu"
                                        },
                                        {
                                            label: "Kamis",
                                            value: "Kamis"
                                        },
                                        {
                                            label: "Jumat",
                                            value: "Jumat"
                                        },
                                        {
                                            label: "Sabtu",
                                            value: "Sabtu"
                                        },
                                        {
                                            label: "Minggu",
                                            value: "Minggu"
                                        },
                                    ]} />
                                </Form.Item>
                                <Form.Item
                                    label="Note"
                                    name="note">
                                    <Input.TextArea placeholder='Note' />
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
    const session = await getSession(ctx);
    const { data } = await http.get('/pengajar/ekstrakurikuler')
    const { data: pengajar } = await http.get('/admin/pengajar')

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
            ekstrakurikuler: data,
            pengajar: pengajar
        },
    };
}
