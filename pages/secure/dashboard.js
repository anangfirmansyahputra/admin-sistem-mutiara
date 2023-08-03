import CardDashboard from "@/components/CardDashboard";
import { BellAlertIcon, BriefcaseIcon, ClipboardDocumentCheckIcon, CubeIcon, FireIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Alert, Button } from "antd";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import http from '@/plugin/https'
import kelasService from "@/services/kelas.service";
import matpelService from "@/services/matpel.service";
import galleryService from "@/services/gallery.service";
import prestasiService from "@/services/prestasi.service";

Dashboard.layout = "L1";

export default function Dashboard({ gallery, matpel, pengajar, siswa, ekstrakurikuler, pengumuman, kelas, prestasi }) {
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
            link: "/secure/pengajar",
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
            link: "/secure/siswa",
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
            link: "/secure/ekstrakurikuler",
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
            link: "/secure/pengumuman",
            linkText: "Lihat semua pengumuman",
        },
        {
            title: "Kelas",
            text: kelas?.length,
            icon: (
                <div className="rounded bg-purple-200 p-1">
                    <BriefcaseIcon className="h-5 w-5 text-purple-500" />
                </div>
            ),
            link: "/secure/kelas",
            linkText: "Lihat semua kelas",
        },
        {
            title: "Mata Pelajaran",
            text: matpel?.length,
            icon: (
                <div className="rounded bg-slate-200 p-1">
                    <CubeIcon className="h-5 w-5 text-slate-500" />
                </div>
            ),
            link: "/secure/matpel",
            linkText: "Lihat semua mata pelajaran",
        },
        {
            title: "Prestasi",
            text: prestasi?.data?.length,
            icon: (
                <div className="rounded bg-orange-200 p-1">
                    <FireIcon className="h-5 w-5 text-orange-500" />
                </div>
            ),
            link: "/secure/prestasi",
            linkText: "Lihat semua prestasi",
        },
        {
            title: "Gallery",
            text: gallery?.length,
            icon: (
                <div className="rounded bg-teal-200 p-1">
                    <FireIcon className="h-5 w-5 text-teal-500" />
                </div>
            ),
            link: "/secure/gallery",
            linkText: "Lihat semua gallery",
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
    const session = await getSession(ctx);
    const { data } = await http.get('/pengajar/ekstrakurikuler')
    const { data: siswa } = await http.get('/siswa')
    const { data: pengajar } = await http.get('/admin/pengajar')
    const { data: pengumuman } = await http.post('/admin/pengumuman/all')
    const { data: kelas } = await kelasService.get()
    const { data: matpel } = await matpelService.get()
    const { data: gallery } = await galleryService.get()
    const { data: prestasi } = await http.get('/prestasi')

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
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
            kelas: kelas,
            matpel: matpel,
            gallery,
            prestasi
        },
    };
}

