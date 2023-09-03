import CardDashboard from "@/components/CardDashboard";
import Pengumuman from "@/components/Pengumuman";
import Profile from "@/components/Profile";
import { BellAlertIcon, ClipboardDocumentCheckIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Alert, Button } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Dashboard({ pengajar, siswa, ekstrakurikuler, pengumuman }) {
    const [pending, setPending] = useState(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
    const router = useRouter();
    const { data } = useSession();
    const role = data?.user?.user?.role;

    console.log(data);

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
        <div>
            <p className="text-xl font-semibold">Dashboard</p>
            {role === "admin" && (
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
            )}
            {role === "siswa" && (
                <div>
                    {pengumuman?.data?.map((item) => (
                        <div key={item?._id}>
                            <Pengumuman {...item} />
                        </div>
                    ))}
                </div>
            )}
            {role === "admin" && pending.length > 0 && (
                <div className="mt-5">
                    <Alert
                        message="Pemberitahuan"
                        showIcon
                        description={`Ada ${pending?.length} ekstrakurikuler yang belum disetujui`}
                        type="warning"
                        action={
                            <Button
                                onClick={() => router.push("/secure/ekstrakurikuler/approve")}
                                size="small"
                                danger>
                                Detail
                            </Button>
                        }
                    />
                </div>
            )}
            {role === "siswa" && (
                <div className="mt-5 flex gap-5">
                    <div className="w-[40%]"></div>
                    <Profile />
                </div>
            )}
        </div>
    );
}
