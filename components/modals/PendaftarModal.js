import { Card, Col, Form, Input, Modal, Row, Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function PendaftarModal(props) {
    const [form] = Form.useForm()
    let data = []
    form.setFieldsValue({
        name: props?.data?.name,
        pengajar: props?.data?.pengajar?.nama
    })

    props?.data?.pendaftar?.map(item => (data.push({
        key: item._id,
        name: item.name,
        nis: item.nis,
        gender: item.gender === "L" ? "Laki - laki" : "Perempuan",
        alamat: item.alamat,
        bop: item.bop,
        tgl: dayjs(item.tgl).format('YYYY-MM-DD'),
        kelas: `${item?.kelas?.kelas} ${item?.kelas?.name}`
    })))

    const columns = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "NIS",
            dataIndex: "nis",
            key: "nis"
        },
        {
            title: "Jenis Kelamin",
            dataIndex: "gender",
            key: "gender"
        },
        {
            title: "Tempat, Tanggal Lahir",
            // dataIndex: "gender",
            // key: "gender"
            render: (_, record) => (
                <span>{`${record.bop}, ${record.tgl}`}</span>
            )
        },
        {
            title: "Kelas",
            dataIndex: "kelas",
            key: "kelas"
        },
    ]

    return (
        <Modal open={props.open} width={1200} onCancel={props.onCancel} title="Data Pendaftar">
            <Card className="m-[20px]">
                <Form form={form} layout="vertical" colon={false}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Ekstrakurikuler" name="name">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Pengajar" name="pengajar">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table columns={columns} dataSource={data} />
            </Card>
        </Modal>
    )
}