import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const { Header } = Layout;

export default function HeaderComp() {
    const { data } = useSession();
    const role = data?.user?.user?.role;

    const items = [
        {
            key: "1",
            danger: false,
            label: (
                <Link
                    href={{
                        pathname: "/profile",
                    }}>
                    Profile
                </Link>
            ),
        },
        {
            key: "2",
            danger: true,
            label: <div onClick={() => signOut({ callbackUrl: (role === "siswa" && "/login-siswa") || (role === "admin" && "/login") || (role === "pengajar" && "/login-pengajar") })}>Logout</div>,
        },
    ];

    // console.log(data?.user?.user?.username);

    return (
        <Header className="site-header bg-red-500">
            <Dropdown
                menu={{
                    items,
                }}
                placement="bottomLeft"
                arrow>
                <Button
                    type="ghost"
                    icon={
                        <UserOutlined
                            style={{
                                color: "white",
                            }}
                        />
                    }>
                    <span className="text-white">{data?.user?.user?.username}</span>
                    <DownOutlined
                        style={{
                            color: "white",
                        }}
                    />
                </Button>
            </Dropdown>
        </Header>
    );
}