import absenService from "@/services/absen.service";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table } from "antd";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

export default function AbsenModal(props) {
    const [form] = Form.useForm()
    const [formAbsen] = Form.useForm()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pertemuan, setPertemuan] = useState(0)

    const handleClose = () => {
        setPertemuan(0)
        setOpen(false)
        setRowKeys([])
        formAbsen.setFieldsValue({ pertemuan: 0 })
    }

    form.setFieldsValue({ name: props?.data?.name })

    const searchInput = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState("")
    const data = props?.data?.pendaftar?.map(item => ({
        key: item?._id,
        name: item?.name,
        nis: item?.nis,
        kelas: `${item?.kelas?.kelas} ${item?.kelas?.name}`,
        pertemuan: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[pertemuan],
        pertemuan1: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[0],
        pertemuan2: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[1],
        pertemuan3: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[2],
        pertemuan4: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[3],
        pertemuan5: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[4],
        pertemuan6: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[5],
        pertemuan7: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[6],
        pertemuan8: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[7],
        pertemuan9: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[8],
        pertemuan10: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[9],
        pertemuan11: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[10],
        pertemuan12: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[11],
        pertemuan13: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[12],
        pertemuan14: item?.nilai?.[props?.data?.wajib ? "ekstrakurikulerWajib" : "ekstrakurikulerPilihan"]?.kehadiran[13],
    }))

    // let absenColumn = []

    // for (let i = 1; i <= 14; i++) {
    //     absenColumn.push({
    //         title: `${i}`,
    //         dataIndex: `pertemuan${i}`,
    //         key: `pertemuan${i}`,
    //         width: "50px",
    //         align: "center",
    //         render: (_, record) => (
    //             <span>{record[`pertemuan${i}`] ? <CheckOutlined style={{
    //                 color: "green"
    //             }} /> : <CloseOutlined style={{
    //                 color: "red"
    //             }} />}</span>
    //         )
    //     },)
    // }

    const absenColumn = [
        {
            title: "I",
            dataIndex: `pertemuan1`,
            key: `pertemuan1`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan1'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan1'] ? "H" : "X"}</span>
            )
        },
        {
            title: "II",
            dataIndex: `pertemuan2`,
            key: `pertemuan2`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan2'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan2'] ? "H" : "X"}</span>
            )
        },
        {
            title: "III",
            dataIndex: `pertemuan3`,
            key: `pertemuan3`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan3'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan3'] ? "H" : "X"}</span>
            )
        },
        {
            title: "IV",
            dataIndex: `pertemuan4`,
            key: `pertemuan4`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan4'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan4'] ? "H" : "X"}</span>
            )
        },
        {
            title: "V",
            dataIndex: `pertemuan5`,
            key: `pertemuan5`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan5'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan5'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VI",
            dataIndex: `pertemuan6`,
            key: `pertemuan6`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan6'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan6'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VII",
            dataIndex: `pertemuan7`,
            key: `pertemuan7`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan7'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan7'] ? "H" : "X"}</span>
            )
        },
        {
            title: "VIII",
            dataIndex: `pertemuan8`,
            key: `pertemuan8`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan8'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan8'] ? "H" : "X"}</span>
            )
        },
        {
            title: "IX",
            dataIndex: `pertemuan9`,
            key: `pertemuan9`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan9'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan9'] ? "H" : "X"}</span>
            )
        },
        {
            title: "X",
            dataIndex: `pertemuan10`,
            key: `pertemuan10`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan10'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan10'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XI",
            dataIndex: `pertemuan11`,
            key: `pertemuan11`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan11'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan11'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XII",
            dataIndex: `pertemuan12`,
            key: `pertemuan12`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan12'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan12'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XIII",
            dataIndex: `pertemuan13`,
            key: `pertemuan13`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan13'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan13'] ? "H" : "X"}</span>
            )
        },
        {
            title: "XIV",
            dataIndex: `pertemuan14`,
            key: `pertemuan14`,
            align: "center",
            render: (_, record) => (
                <span className={`${record['pertemuan14'] ? "text-green-500" : "text-red-500"}`}>{record['pertemuan14'] ? "H" : "X"}</span>
            )
        },
    ]

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
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "150px",
            ...getColumnSearchProps("name"),
            fixed: "left",
            // render: (_, record) => (
            //     <Link
            //         href={{
            //             pathname: `/ekstrakurikuler/${record?.key}`,
            //         }}>
            //         {record?.name}
            //     </Link>
            // ),
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            ...getColumnSearchProps("nis"),
            width: 150
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            ...getColumnSearchProps("kelas"),
            width: 50
        },
        ...absenColumn
    ];

    const columnsAbsen = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
            width: "200px",
            ...getColumnSearchProps("name"),
            fixed: "left",
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis",
            ...getColumnSearchProps("nis"),
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            ...getColumnSearchProps("kelas"),
        },
        {
            title: `Pertemuan ke-${pertemuan + 1}`,
            dataIndex: "pertemuan",
            key: "pertemuan",
            render: (_, record) => (
                <span className={`${record?.pertemuan ? "text-green-500" : "text-red-500"}`}>{record?.pertemuan ? "H" : "X"}</span>
            )
        }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            // Column configuration not to be checked
            name: record.name,
        }),
        selectedRowKeys,
    };

    const handleSubmit = (values) => {
        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data absen disimpan",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = {
                    listSiswa: selectedRowKeys,
                    pertemuan: values.pertemuan,
                    ekstrakurikuler: props.data._id
                }

                // console.log(payload);

                setLoading(true)


                try {
                    const res = await absenService.absen(payload)

                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil disimpan"
                    })
                    setPertemuan(0)
                    formAbsen.setFieldsValue({ pertemuan: 0 })
                    router.push(router.asPath)
                    setOpen(false)
                    props.onCancel()
                    form.resetFields()
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal disimpan, coba ganti data dan coba kembali!"
                    })
                } finally {
                    setRowKeys([])
                    formAbsen.resetFields()
                    setLoading(false)
                }
            } else if (result.isDenied) {
            }
        })
    }

    return (
        <>
            <Modal width={1200} onCancel={props.onCancel} onOk={<Button onClick={props.onCancel}>Tutup</Button>} open={props.open} title="Absensi">
                <Card className="m-[20px]">
                    <Form form={form} colon={false} layout="vertical">
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item name="name" label="Ekstrakurikuler" >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            {props?.data?.pendaftar?.length > 0 && (
                                <Col span={6}>
                                    <Form.Item name="name" label=" " >
                                        <Button type="primary" onClick={() => setOpen(true)}>Beri Nilai</Button>
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Form>
                    <Table size="small" dataSource={data} columns={columns} scroll={{
                        x: 1500
                    }} />
                </Card>
            </Modal>
            <Modal title="Form Nilai Absen" open={open} onOk={() => formAbsen.submit()} onCancel={handleClose} width={1200}>
                <Card className="m-[20px]" loading={loading}>
                    <Form form={formAbsen} onFinish={handleSubmit}>
                        <Col span={6}>
                            <Form.Item label="Pertemuan" colon={false} name="pertemuan">
                                <Select placeholder="Pertemuan" options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(item => ({
                                    label: `Pertemuan - ${item + 1}`
                                    , value: item
                                }))} defaultValue={pertemuan} value={pertemuan} onChange={e => setPertemuan(e)} />
                            </Form.Item>
                        </Col>
                    </Form>
                    <Table dataSource={data} columns={columnsAbsen} rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }} />
                </Card>
            </Modal>
        </>
    )
}