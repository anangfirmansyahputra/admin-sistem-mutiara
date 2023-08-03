import matpelService from "@/services/matpel.service";
import { DownOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Dropdown, Form, Input, Layout, Modal, Space, Table, Typography, message } from "antd";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";


MatpelPage.layout = "L1";
const { Content } = Layout

export default function MatpelPage({ matpel }) {
    const { push, asPath } = useRouter();
    const { data: session } = useSession();
    const [form] = Form.useForm()

    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [modalOpen, setModalOpen] = useState(false)
    const [edit, setEdit] = useState({
        isEdit: false,
        id: null
    })

    let data = []

    const searchInput = useRef(null);

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

    const handleSubmit = async (payload) => {
        try {
            setLoadingFirst(true);
            if (edit.id !== null && edit.isEdit !== false) {
                const res = await matpelService.update(edit.id, payload)
                message.success(res?.message);
            } else {
                const res = await matpelService.create(payload)
                message.success(res?.message);
            }
            push(asPath);
        } catch (err) {
            message.error(err.response.data.message || err.message);
        } finally {
            setLoadingFirst(false);
            setModalOpen(false)
            setEdit({
                id: null,
                isEdit: false
            })
            form.resetFields()
        }
    };

    matpel?.data?.map(item => data.push({
        matpel: item?.name,
        key: item?._id
    }))

    // Function
    const deleteMatpel = (id) => {
        Swal.fire({
            title: 'Yakin ingin menghapus data ini?',
            showDenyButton: true,
            icon: "question",
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const res = await matpelService.delete(id)

                if (res.success) {
                    Swal.fire('Berhasil!', res.message, 'success').then(() => push(asPath))
                } else {
                    Swal.fire('Gagal!', res.message, 'error')
                }
            } else if (result.isDenied) {
                // Swal.fire('Changes are not saved', '', 'info')
            }
        })
    };

    const columns = [
        {
            title: "Mata Pelajara",
            dataIndex: "matpel",
            key: "matpel",
            ...getColumnSearchProps("matpel"),
        },
        {
            title: "Action",
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: '1',
                                label: 'Edit',
                                onClick: () => {
                                    form.setFieldsValue(matpel?.data?.find(item => item._id === record?.key))
                                    setEdit({
                                        isEdit: true,
                                        id: record?.key
                                    })
                                    setModalOpen(true)
                                },
                            },
                            {
                                key: '2',
                                danger: true,
                                label: 'Delete',
                                onClick: () => {
                                    deleteMatpel(record?.key)
                                },
                            },
                        ],
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Action
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            ),
        }
    ];

    return (
        <>
            <Head>
                <title>Mata Pelajaran | Sistem Informasi Mutiara</title>
            </Head>
            <Content>
                <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Mata Pelajaran</Typography.Title>
                <div className="mb-5 flex items-center justify-between">
                    <Breadcrumb items={[
                        {
                            title: <Link href={{
                                pathname: "/secure/dashboard"
                            }}>Dashboard</Link>
                        },
                        {
                            title: "Mata Pelajaran"
                        }
                    ]} />
                    <Button onClick={() => setModalOpen(true)} type="primary" icon={<PlusOutlined />}>Mata Pelajaran</Button>
                </div>
                <Card title="Data Mata Pelajaran">
                    <Table
                        sticky
                        bordered
                        size="small"
                        columns={columns}
                        dataSource={data}
                    />
                </Card>

                <Modal
                    title="Mata Pelajaran"
                    centered
                    open={modalOpen}
                    onCancel={() => {
                        setModalOpen(false)
                        setEdit({
                            id: null,
                            isEdit: false
                        })
                        form.resetFields()
                    }}
                    footer={[
                        <Button
                            onClick={form.submit}
                            htmlType="submit"
                            // key="submit"
                            type="primary"
                        >
                            Tambah
                        </Button>,
                    ]}
                >
                    <Form form={form} layout="vertical" className="p-5" onFinish={handleSubmit}>
                        <Form.Item label="Mata Pelajaran" name="name">
                            <Input placeholder="Mata pelajaran" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content >
        </>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    const matpel = await matpelService.get()

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {},
        };
    }
    return {
        props: {
            matpel: matpel
        },
    };
}
