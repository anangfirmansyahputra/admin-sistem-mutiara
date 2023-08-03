import http from '@/plugin/https';
import ekstrakurikulerService from '@/services/ekstrakurikuler.service';
import kelasService from '@/services/kelas.service';
import prestasiService from "@/services/prestasi.service";
import siswaService from '@/services/siswa.service';
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Space, Typography, Upload, message } from "antd";
import dayjs from 'dayjs';
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from 'sweetalert2';


Prestasi.layout = "L1";

const { Meta } = Card;

export default function Prestasi({ kelas, prestasi, siswa, ekstrakurikuler }) {
    // State
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loadingFirst, setLoadingFirst] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);
    const [id, setId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [img, setImg] = useState(null);
    const [imgSertifikat, setImgSertifikat] = useState(null);

    const [kelasValue, setKelasValue] = useState(null)

    const [open, setOpen] = useState(false)

    const searchInput = useRef(null);
    const data = [];
    const { push, asPath } = useRouter();
    const router = useRouter()
    const { data: session } = useSession();
    const [form] = Form.useForm()
    const token = session?.user?.user?.accessToken;

    const handleClose = () => {
        setOpen(false)
        setId(null)
        setIsEdit(false)
        setKelasValue(null)
        form.resetFields()
    }

    kelas?.map((item) =>
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

    const handleSubmit = (values) => {

        var formData = new FormData();

        if (values.images1 && values.images2) {
            formData.append("images", values?.images1?.file?.originFileObj);
            formData.append("images", values?.images2?.file?.originFileObj);
        }

        formData.append("ekstrakurikuler", values?.ekstrakurikuler);
        formData.append("siswa", values.siswa);
        formData.append("kelas", values.kelas);
        formData.append("deskripsi", values.deskripsi);
        formData.append("tgl", values.tgl);

        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: isEdit ? "Data akan dirubah" : "Data akan disimpan",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)

                try {
                    if (isEdit) {
                        const res = await prestasiService.update(id, formData)
                    } else {
                        const res = await prestasiService.create(formData)
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
                    setKelasValue(null)
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                } finally {
                    setLoading(false)
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
            const { data } = await prestasiService.find(id)

            setKelasValue(data.kelas)
            form.setFieldsValue({
                siswa: data.siswa,
                tgl: dayjs(data.tgl),
                deskripsi: data.deskripsi,
                kelas: data.kelas,
                ekstrakurikuler: data.ekstrakurikuler
            })

        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: "Gagal",
                text: "Server sedang mengalami gangguan, silahkan coba kembali"
            })
        }
    }

    return (
        <>
            <Head>
                <title>Prestasi | Sistem Informasi Mutiara</title>
            </Head>
            <>
                <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>Prestasi</Typography.Title>
                <div className="mb-5 flex items-center justify-between">
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
                    <Button
                        onClick={() => setOpen(true)}
                        type="primary"
                        icon={<PlusOutlined />}>
                        Tambah
                    </Button>
                </div>
                {/* <Input style={{ width: 300, marginBottom: 20 }} /> */}
                <div className="grid grid-cols-4 gap-5 mb-5">
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
                                    onClick={() => {
                                        handleEdit(item?._id)
                                    }}
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

                <Modal open={open} width={1200} onOk={() => form.submit()} onCancel={handleClose} title="Form Prestasi">
                    <Card className='m-[20px]' loading={loading}>
                        <Form colon={false} form={form} onFinish={handleSubmit} labelWrap labelCol={{ span: 6 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Siswa" name="siswa" required rules={[{ message: "Mohon pilih siswa", required: true }]}>
                                        <Select
                                            placeholder="Siswa"
                                            disabled={!kelasValue}
                                            options={siswa?.filter(item => item?.kelas?._id === kelasValue)?.map(item => ({
                                                label: item?.name,
                                                value: item?._id
                                            }))}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Kelas" required rules={[{ message: "Mohon pilih kelas", required: true }]} name="kelas">
                                        <Select placeholder="Kelas" onChange={e => {
                                            form.setFieldsValue({ siswa: undefined })
                                            setKelasValue(e)
                                        }} options={kelas?.map(item => ({
                                            label: `${item?.kelas} ${item?.name}`,
                                            value: item?._id
                                        }))} />
                                    </Form.Item>
                                    <Form.Item label="Judul" name="deskripsi" required rules={[{ message: "Mohon isi deskripsi", required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ekstrakurikuler" name="ekstrakurikuler" required rules={[{ message: "Mohon pilih ekstrakurikulelr", required: true }]}>
                                        <Select placeholder="Ekstrakurikuler" options={ekstrakurikuler?.map(item => ({
                                            label: item?.name,
                                            value: item?._id
                                        }))} />
                                    </Form.Item>
                                    <Form.Item label="Tanggal" name="tgl" required rules={[{ message: "Mohon isi tanggal", required: true }]}>
                                        <DatePicker style={{ width: "100%" }} placeholder='Tanggal' />
                                    </Form.Item>
                                    <Form.Item
                                        label="Upload Img"
                                        name="images1">
                                        <Upload
                                            onChange={(values) => setImg(values)}
                                            // {...props}
                                            maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        name="images2"
                                        label="Upload Sertifikat">
                                        <Upload
                                            onChange={(values) => setImgSertifikat(values)}
                                            // {...props}
                                            maxCount={1}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
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
    const { data: prestasi } = await http.get('/prestasi')
    const { data: siswa } = await siswaService.get()
    const { data: ekstrakurikuler } = await ekstrakurikulerService.get()
    const { data: kelas } = await kelasService.get()
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
            kelas: kelas,
            prestasi: prestasi,
            siswa: siswa.sort((a, b) => {
                // Mengurutkan berdasarkan kelas.kelas
                const compareKelas = a.kelas.kelas.localeCompare(b.kelas.kelas);

                // Jika kelas.kelas sama, maka urutkan berdasarkan kelas.name (abjad)
                if (compareKelas === 0) {
                    return a.kelas.name.localeCompare(b.kelas.name);
                }

                return compareKelas;
            }),
            ekstrakurikuler: ekstrakurikuler
        },
    };
}

