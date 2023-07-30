Login.layout = "L2";

import useLoginContext from "@/context/useLoginContext";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Skeleton, Spin, Typography } from "antd";
import Head from "next/head";

const { Title, Text } = Typography;

export default function Login() {
    const [form] = Form.useForm();
    const { loading, handleLogin, contextHolder } = useLoginContext();

    const onFinish = (values) => {
        handleLogin(values);
        form.resetFields();
    };

    return (
        <>
            <Head>
                <title>Login | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div className="w-full h-screen flex items-center justify-center bg-[#f3f3f3] rounded-lg overflow-hidden">
                {contextHolder}
                <div className="bg-white px-5 pb-5 shadow-xl w-[300px]">
                    <Skeleton
                        active={true}
                        loading={false}>
                        <Spin spinning={loading}>
                            <div className="mb-10">
                                <Title
                                    className="text-center"
                                    level={4}>
                                    Sistem Admin
                                </Title>
                            </div>
                            <Form
                                name="normal_login"
                                className="login-form"
                                form={form}
                                style={{
                                    width: 300,
                                }}
                                onFinish={onFinish}>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Username!",
                                        },
                                    ]}>
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Username"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Password!",
                                        },
                                    ]}>
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        style={{
                                            width: "100%",
                                            marginTop: 10,
                                        }}
                                        type="primary"
                                        htmlType="submit">
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Form>
                            <p className="font-sans text-[12px] text-center text-gray-500">Copyright © 2023 Sekolah Mutiara. All Rights Reserved.</p>
                        </Spin>
                    </Skeleton>
                </div>
            </div>
        </>

    );
}
