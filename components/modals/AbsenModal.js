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

    const handleClose = () => {
        setOpen(false)
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
        pertemuan1: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[0],
        pertemuan2: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[1],
        pertemuan3: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[2],
        pertemuan4: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[3],
        pertemuan5: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[4],
        pertemuan6: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[5],
        pertemuan7: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[6],
        pertemuan8: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[7],
        pertemuan9: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[8],
        pertemuan10: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[9],
        pertemuan11: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[10],
        pertemuan12: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[11],
        pertemuan13: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[12],
        pertemuan14: item?.nilai?.ekstrakurikulerPilihan?.kehadiran[13],
    }))

    let absenColumn = []

    for (let i = 1; i <= 14; i++) {
        absenColumn.push({
            title: `Pertemuan ${i}`,
            dataIndex: `pertemuan${i}`,
            key: `pertemuan${i}`,
            width: "120px",
            align: "center",
            render: (_, record) => (
                <span>{record[`pertemuan${i}`] ? <CheckOutlined style={{
                    color: "green"
                }} /> : <CloseOutlined style={{
                    color: "red"
                }} />}</span>
            )
        },)
    }

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
            width: "200px",
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
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas",
            ...getColumnSearchProps("kelas"),
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

                try {
                    const res = await absenService.absen(payload)
                    console.log(res);

                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil disimpan"
                    })
                    router.push(router.asPath)
                    setOpen(false)
                    form.resetFields()
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
            <Modal width={1200} onCancel={props.onCancel} open={props.open} title="Absensi">
                <Card className="m-[20px]">
                    <Form form={form} colon={false} layout="vertical">
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item name="name" label="Ekstrakurikuler" >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="name" label=" " >
                                    <Button type="primary" onClick={() => setOpen(true)}>Beri Nilai</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table size="small" dataSource={data} columns={columns} scroll={{
                        x: 2300
                    }} />
                </Card>
            </Modal>
            <Modal title="Form Nilai Absen" open={open} onOk={() => formAbsen.submit()} onCancel={handleClose} width={1200}>
                <Card className="m-[20px]">
                    <Form form={formAbsen} onFinish={handleSubmit}>
                        <Col span={6}>
                            <Form.Item label="Pertemuan" colon={false} name="pertemuan">
                                <Select placeholder="Pertemuan" options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(item => ({
                                    label: `Pertemuan - ${item + 1}`
                                    , value: item
                                }))} />
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