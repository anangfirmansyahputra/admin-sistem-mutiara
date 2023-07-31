import { Button, Card, Col, Descriptions, Modal, Row } from "antd";
import dayjs from "dayjs";

export default function DetailSiswaModal(props) {
    const { data } = props
    const wajib = data?.nilai?.ekstrakurikulerWajib
    const pilihan = data?.nilai?.ekstrakurikulerPilihan

    const totalNilai = (akademik, data) => {
        const nilaiAkademik = (akademik * 60) / 100
        // const nilaiAbsen = ((absen / 14) * 100) * 40 / 100
        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true
        const percentageTrue = Math.ceil(((totalTrue / totalLength) * 100) * 40 / 100);


        const nilaiTotal = percentageTrue + nilaiAkademik

        if (nilaiTotal >= 86) {
            return 'A'
        } else if (nilaiTotal >= 76 && nilaiTotal <= 85) {
            return 'B'
        } else {
            return 'C'
        }

    }

    const nilaiAbsen = (data) => {
        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true
        const percentageTrue = Math.ceil((totalTrue / totalLength) * 100);

        return percentageTrue
    }


    return (
        <Modal open={props.open} onCancel={props.onCancel} footer={<Button onClick={() => props.onCancel()}>Tutup</Button>} width={1200} title="Detail Siswa" centered style={{
            top: 20
        }}>
            <Card title="1. Profil Siswa" size="small" className="m-[20px]" style={{ marginBottom: "1rem" }}>
                <Row>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Nama">{data?.name}</Descriptions.Item>
                            <Descriptions.Item label="NIS">{data?.nis}</Descriptions.Item>
                            <Descriptions.Item label="Kelas">{`${data?.kelas?.kelas} ${data?.kelas?.name}`}</Descriptions.Item>
                            <Descriptions.Item label="Jenis Kelamin">{data?.gender === "L" ? "Laki - laki" : "Perempuan"}</Descriptions.Item>
                            <Descriptions.Item label="Tempat Tanggal Lahir">{`${data?.bop}, ${dayjs(data?.tgl).format('YYYY-MM-DD')}`}</Descriptions.Item>
                            <Descriptions.Item label="Nomor Telp">{data?.noTlp}</Descriptions.Item>
                            <Descriptions.Item label="Alamat">{data?.alamat}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>
            <Card title="2. Nilai Siswa" size="small" className="m-[20px]">
                <Row gutter={16}>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Ekstrakurikuler Wajib">{wajib?.ekstrakurikuler?.name ?? "Belum memilih"}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Akademik">{wajib?.nilai}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Absen">{nilaiAbsen(wajib?.kehadiran)}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Total">
                                {totalNilai(wajib?.nilai, wajib?.kehadiran)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Ekstrakurikuler Pilihan">{pilihan?.ekstrakurikuler?.name ?? "Belum memilih"}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Akademik">{pilihan?.nilai}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Absen">{nilaiAbsen(pilihan?.kehadiran)}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Total">
                                {totalNilai(pilihan?.nilai, pilihan?.kehadiran)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>
        </Modal>
    )
}