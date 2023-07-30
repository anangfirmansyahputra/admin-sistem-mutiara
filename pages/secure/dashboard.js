import CardDashboard from "@/components/CardDashboard";
import { BellAlertIcon, ClipboardDocumentCheckIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Alert, Button } from "antd";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import http from '@/plugin/https'

Dashboard.layout = "L1";

export default function Dashboard({ pengajar, siswa, ekstrakurikuler, pengumuman }) {
    const [pending, setPending] = useState(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
    const router = useRouter();
    const { data: session } = useSession()

    const items = [
        {
            title: "Pengajar",
            text: pengajar?.data?.length,
            icon: (
                <div className="rounded bg-red-200 p-1">
                    <UsersIcon className="h-5 w-5 text-red-500" />
                </div>
            ),
            link: "/pengajar",
            linkText: "Lihat semua pengajar",
            bg: "bg-red-100",
        },
        {
            title: "Siswa",
            text: siswa?.data?.length,
            icon: (
                <div className="rounded bg-green-200 p-1">
                    <UserGroupIcon className="h-5 w-5 text-green-500" />
                </div>
            ),
            link: "/siswa",
            linkText: "Lihat semua siswa",
        },
        {
            title: "Ekstrakurikuler",
            text: ekstrakurikuler?.data?.length,
            icon: (
                <div className="rounded bg-blue-200 p-1">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-500" />
                </div>
            ),
            link: "/ekstrakurikuler",
            linkText: "Lihat semua ekstrakurikuler",
        },
        {
            title: "Pengumuman",
            text: pengumuman?.data?.length,
            icon: (
                <div className="rounded bg-yellow-200 p-1">
                    <BellAlertIcon className="h-5 w-5 text-yellow-500" />
                </div>
            ),
            link: "/pengumuman",
            linkText: "Lihat semua pengumuman",
        },
    ];

    return (
        <>
            <Head>
                <title>Dashboard | Sistem Informasi Sekolah Mutiara</title>
            </Head>
            <div>
                <p className="text-xl font-semibold">Dashboard</p>
                <div className="grid grid-cols-4 gap-5">
                    {items?.map((item) => (
                        <CardDashboard
                            key={item?.title}
                            text={item?.text}
                            title={item?.title}
                            icon={item?.icon}
                            link={item?.link}
                            linkText={item?.linkText}
                        />
                    ))}
                </div>
                {pending?.length > 0 && (
                    <div className="mt-5">
                        <Alert
                            message="Pemberitahuan"
                            showIcon
                            description={`Ada ${pending?.length} ekstrakurikuler yang belum disetujui`}
                            type="warning"
                            action={
                                <Button
                                    onClick={() => router.push("/ekstrakurikuler/approve")}
                                    size="small"
                                    danger>
                                    Detail
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    const { data } = await http.get('/pengajar/ekstrakurikuler')
    const { data: siswa } = await http.get('/siswa')
    const { data: pengajar } = await http.get('/admin/pengajar')
    const { data: pengumuman } = await http.get('/admin/pengumuman')

    if (!session) {
        return {
            redirect: {
                destination: "/login",
            },
            props: {},
        };
    }

    return {
        props: {
            ekstrakurikuler: data,
            siswa: siswa,
            pengajar: pengajar,
            pengumuman: pengumuman,
        },
    };
}

