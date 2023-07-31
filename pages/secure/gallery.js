import galleryService from "@/services/gallery.service";
import { DeleteOutlined, DownOutlined, PlusCircleFilled, PlusCircleOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, DatePicker, Dropdown, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Typography, message } from "antd";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import http from '@/plugin/https'
import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import Swal from "sweetalert2";

Gallery.layout = "L1";

export default function Gallery({ gallery, ekstrakurikuler }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);
    const [open, setOpen] = useState(false)
    const [id, setId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)

    const searchInput = useRef(null);
    const [form] = Form.useForm()
    const data = [];
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const router = useRouter()
    const token = session?.user?.user?.accessToken;

    gallery?.map((item) =>
        data.push({
            key: item._id,
            description: item?.description ?? "-",
            linkGallery: item?.linkGallery ?? "-",
            ekstrakurikuler: item?.ekstrakurikuler?.name ?? "-",
            tglUpload: dayjs(item?.tglUpload).format("DD/MM/YY") ?? "-",
        })
    );

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
            const res = await galleryService.delete({ ids: selectedRow });
            message.success(res?.message);
            push(asPath);
        } catch (err) {
            message.error(err?.message);
        } finally {
            setLoadingFirst(false);
        }
    };

    const items = (id, link) => {
        return [
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
                    <a rel="" target="_blank" href={link}>
                        Lihat
                    </a>
                ),
                key: '3',
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

    const handleEdit = async (id) => {
        try {
            setOpen(true)
            setId(id)
            setIsEdit(true)


            const { data } = await galleryService.find(id)
            const findData = {
                ekstrakurikuler: data.ekstrakurikuler._id,
                linkGallery: data.linkGallery,
                description: data.description,
            }

            form.setFieldsValue(findData);

        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Server sedang error, silahkan coba kembali"
            })
        }
    }


    const columns = [
        {
            title: "Deskripsi",
            dataIndex: "description",
            key: "description",
            ...getColumnSearchProps("description"),
            // render: (_, record) => (
            //     <Link
            //         href={{
            //             pathname: `/gallery/${record?.key}`,
            //         }}>
            //         {record?.description}
            //     </Link>
            // ),
        },
        {
            title: "Ekstrakurikuler",
            dataIndex: "ekstrakurikuler",
            key: "ekstrakurikuler",
            ...getColumnSearchProps("ekstrakurikuler"),
        },
        {
            title: "Tanggal",
            dataIndex: "tglUpload",
            key: "tglUpload",
            ...getColumnSearchProps("tglUpload"),
        },
        // {
        //     title: "Link",
        //     dataIndex: "linkGallery",
        //     key: "linkGallery",
        //     ...getColumnSearchProps("linkGallery"),
        //     render: (_, record) => (
        //         <Link
        //             target="_blank"
        //             href={{
        //                 pathname: record?.linkGallery,
        //             }}>
        //             Lihat
        //         </Link>
        //     ),
        // },
        {
            title: "Aksi",
            fixed: "right",
            width: "100px",
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: items(record.key, record.linkGallery)
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
            setSelectedRow(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
        }),
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
                        const res = await galleryService.update(values, id)
                    } else {

                        const res = await galleryService.create(values)
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
                    // const messageErr = JSON.parse(err?.request?.response)?.message
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: "Gagal",
                    //     text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    // })
                }
            } else if (result.isDenied) {
            }
        })
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
                    const res = await galleryService.deleteOne(id)
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
                        text: messageErr ?? "Data gagal dihapus, coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        }
        )
    }

    return (
        <>
            <Head>
                <title>Gallery | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Gallery</Typography.Title>
                <div className="mb-5 flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/secure/dashboard">Dashboard</Link>,
                            },
                            {
                                title: "Gallery",
                            },
                        ]}
                    />
                    <Button
                        onClick={() => setOpen(true)}
                        type="primary"
                        icon={<PlusOutlined />}>
                        Tambah
                    </Button>
                </div>
                <Card title="Data Gallery">
                    <Table
                        sticky
                        bordered
                        size="small"
                        columns={columns}
                        dataSource={data}
                    />
                </Card>
                <Modal open={open} width={1200} onCancel={handleCancel} title="Form Gallery" footer={<Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>Submit</Button>}>
                    <Card className="m-[20px]">
                        <Form form={form} labelCol={{ span: 6 }} onFinish={handleSubmit} labelAlign="left" colon={false}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Ekstrakurikuler" required name="ekstrakurikuler" rules={[
                                        { message: "Mohon pilih ekstrakurikuler", required: true }
                                    ]}>
                                        <Select placeholder="Ekstrakurikuler" options={[
                                            ...ekstrakurikuler.map(item => ({
                                                value: item._id,
                                                label: item?.name
                                            }))
                                        ]} />
                                    </Form.Item>
                                    {/* <Form.Item label="Ditujukan" name="for" rules={[
                                        {
                                            message: "Mohon pilih ditujukan",
                                            required: true
                                        }
                                    ]}>
                                        <Select placeholder="Ditujukan" mode="multiple" options={[
                                            {
                                                value: "siswa",
                                                label: "Siswa"
                                            },
                                            {
                                                value: "pengajar",
                                                label: "Pengajar"
                                            }
                                        ]} />
                                    </Form.Item> */}
                                    <Form.Item required name="description" label="Deskripsi" rules={[
                                        {
                                            message: "Mohon isi deskripsi",
                                            required: true
                                        }
                                    ]}>
                                        <Input.TextArea placeholder="Deskripsi" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {/* <Form.Item required name="endDate" label="Tanggal Berlaku" rules={[
                                        {
                                            message: "Mohon isi tanggal berlaku",
                                            required: true
                                        }
                                    ]}>
                                        <DatePicker style={{ width: "100%" }} />
                                    </Form.Item> */}
                                    <Form.Item required name="linkGallery" label="Link" rules={[
                                        {
                                            message: "Mohon isi link",
                                            required: true
                                        }
                                    ]}>
                                        <Input placeholder="Link" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Modal>
            </>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await galleryService.get()
    const { data: ekstrakurikuler } = await ekstrakurikulerService.get()
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
            gallery: data,
            ekstrakurikuler: ekstrakurikuler
        },
    };
}
