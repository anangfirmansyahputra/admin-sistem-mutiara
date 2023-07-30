import { Button, Card, Col, Form, Modal, Row, Select, Space, Tabs } from "antd";

export default function JoinModal(props) {
    return (
        <Modal open={false} title="Join Ekstrakurikuler">
            <Card className="m-[20px]">
                <Space style={{ width: "100%", display: "flex", justifyContent: "center" }} align="center" >
                    <Button size="large" type="primary">Wajib</Button>
                    <Button size="large">Pilihan</Button>
                </Space>
                {/* <Form layout="vertical">
                    <Form.Item label="Ekstrakurikuler Wajib" name="ekstraId">
                        <Select />
                    </Form.Item>
                </Form> */}
            </Card>
        </Modal>
    )
}