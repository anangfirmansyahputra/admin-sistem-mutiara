import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import nilaiService from "@/services/nilai.service";
import { Button, Form, Input, InputNumber, Modal, Table, Card } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NilaiModal(props) {
    const [form] = Form.useForm()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [selectSiswa, setSelecSiswa] = useState(null)

    const data = props?.data?.pendaftar?.map(item => ({
        key: item?._id,
        name: item?.name,
        nis: item?.nis,
        kelas: `${item?.kelas?.kelas} ${item?.kelas?.name}`,
        nilai: item?.nilai?.[props?.data?.wajib ? 'ekstrakurikulerWajib' : 'ekstrakurikulerPilihan']?.nilai
    }))

    const handleNilai = (id, name) => {
        form.setFieldsValue({ name: name })
        setSelecSiswa(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelecSiswa(null)
        form.resetFields()
    }

    const columns = [
        {
            title: "Nama",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "NIS",
            key: "nis",
            dataIndex: "nis"
        },
        {
            title: "Kelas",
            key: "kelas",
            dataIndex: "kelas"
        },
        {
            title: "Nilai",
            key: "nilai",
            dataIndex: "nilai"
        },
        {
            title: "Aksi",
            fixed: "right",
            width: "100px",
            render: (_, record) => (
                <Button type="primary" onClick={() => handleNilai(record?.key, record?.name)}>Beri Nilai</Button>
            )
        },
    ]

    const handleSubmit = async (values) => {
        const payload = {
            wajib: props?.data?.wajib,
            nilai: values.nilai
        }

        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data akan dirubah",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await nilaiService.beriNilai(selectSiswa, payload)
                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil diupdate"
                    })
                    router.push(router.asPath)
                    setOpen(false)
                    form.resetFields()
                    setSelecSiswa(null)
                    // props.onCancel()
                    const resData = await ekstrakurikulerService.find(props?.data?._id)
                    props?.setDataPendaftar(resData.data)
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal dirubah, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }


    return (
        <>
            <Modal open={props.open} onCancel={props.onCancel} footer={<Button onClick={props.onCancel}>Tutup</Button>} width={1200} title="Form Nilai">
                <Card className="m-[20px]">
                    <Table columns={columns} dataSource={data} />
                </Card>
            </Modal>
            <Modal open={open} title="Beri Nilai" onOk={() => form.submit()} onCancel={handleClose}>
                <Card className="m-[20px]">
                    <Form form={form} colon={false} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Nama" name="name">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Nilai" name="nilai">
                            <InputNumber placeholder="0" style={{ width: "100%" }} maxLength={3} max={100} />
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
        </>
    )
}