import { items } from "@/constants";
import { Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const { Sider } = Layout;

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const { data } = useSession();

    const selectedKey = (router.pathname === "/secure/dashboard" && "dashboard") || (router.pathname.includes("/pengajar") && "pengajar") || (router.pathname.includes("/ekstrakurikuler") && "ekstrakurikuler") || (router.pathname.includes("/siswa") && "siswa") || (router.pathname.includes("/absensi") && "absensi") || (router.pathname.includes("/prestasi") && "prestasi") || (router.pathname.includes("/pengumuman") && "pengumuman") || (router.pathname.includes("/gallery") && "gallery") || (router.pathname.includes("/kelas") && "kelas") || (router.pathname.includes("/matpel") && "matpel");

    return (
        <Sider
            breakpoint="lg"
            width={200}
            // collapsible
            theme="light"
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            onBreakpoint={(broken) => { }}>
            <Link
                style={{
                    padding: "0 16px",
                    height: "40px",
                    lineHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "start",
                    backgroundColor: "#008344",
                }}
                href={{
                    pathname: "/",
                }}>
                <span className="text-white">Sekolah Mutiara</span>
            </Link>
            <Menu
                activeKey="dashboard"
                theme="light"
                items={items}
                selectedKeys={[selectedKey]}
                onSelect={(e) => router.push(e.key === "dashboard" ? "/secure/dashboard" : "/secure/" + e.key)}
            />
        </Sider>
    );
}
