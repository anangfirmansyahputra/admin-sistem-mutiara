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
        </>
    )
}

export async function getServerSideProps(ctx) {
    // const session = await getSession(ctx)
    // const { data } = await http.get('/pengajar/ekstrakurikuler')
    // const { data: siswa } = await http.get('/siswa')
    // const { data: pengajar } = await http.get('/admin/pengajar')
    // const { data: pengumuman } = await http.get('/admin/pengumuman')

    return {
        redirect: {
            destination: "/secure/dashboard",
        },
        props: {},
    };

    // return {
    //     props: {
    //         ekstrakurikuler: data,
    //         siswa: siswa,
    //         pengajar: pengajar,
    //         pengumuman: pengumuman,
    //     },
    // };
}

