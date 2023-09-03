import { Alert, Breadcrumb, Button, Popconfirm, Space, message } from "antd";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import http from '@/plugin/https'

Ekstrakurikuler.layout = "L1";

export default function Ekstrakurikuler({ ekstrakurikuler }) {
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.user?.accessToken;

    const config = {
        headers: { "admin-token": `${token}` },
    };

    const cancel = (e) => {
        console.log(e);
        message.error("Click on No");
    };

    const handleApprove = async (id) => {
        Swal.fire({
            title: "Yakin ingin meng aprovenya?",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "Iya",
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.put(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/admin/ekstrakurikuler/approve/${id}`);
                    Swal.fire("Berhasil", data?.message, "success").then(() => {
                        // setShowPending(false);
                        // setPending(ekstrakurikuler?.data?.filter((item) => item?.approve === false));
                        router.push("/secure/ekstrakurikuler");
                    });
                } catch (err) {
                    Swal.fire("Gagal", err?.data?.message, "error");
                }
            }
        });
    };

    const handleReject = async (id) => {
        Swal.fire({
            title: "Yakin ingin meng aprovenya?",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "Iya",
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.delete(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/ekstrakurikuler/${id}`);
                    router.push(router.asPath).then(() => message.success(data?.message));
                } catch (err) {
                    message.error(err?.data?.message);
                }
            }
        });
    };

    return (
        <div>
            <div className="my-5 flex items-center justify-between">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/">Dashboard</Link>,
                        },
                        {
                            title: <Link href="/ekstrakurikuler">Ekstrakurikuler</Link>,
                        },
                        {
                            title: "Approve",
                        },
                    ]}
                />
            </div>
            <div className="mt-5 flex flex-col gap-3">
                {ekstrakurikuler?.data?.map(
                    (item) =>
                        item?.approve === false && (
                            <Alert
                                message={<span className="font-semibold">{item?.nama}</span>}
                                description={
                                    <div>
                                        <div className="flex items-center gap-5">
                                            {`Diajukan oleh ${item?.pengajar?.nama}`} <div className={`${item?.wajib ? "bg-green-300" : "bg-yellow-300"} rounded px-5 py-1`}>{item?.wajib ? "Wajib" : "Pilihan"}
                                            </div>
                                        </div>

                                        <span className="font-semibold text-lg">
                                            {item?.name}
                                        </span>
                                    </div>
                                }
                                type={item?.wajib ? "success" : "warning"}
                                action={
                                    <Space direction="vertical">
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => handleApprove(item?._id)}>
                                            Approve
                                        </Button>
                                        <Popconfirm
                                            title="Delete the task"
                                            description="Are you sure to delete this task?"
                                            onConfirm={() => handleReject(item?._id)}
                                            onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No">
                                            <Button type="link">Delete</Button>
                                        </Popconfirm>
                                    </Space>
                                }
                            />
                        )
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const { data } = await http.get('/pengajar/ekstrakurikuler')

    // if (!session) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/login",
    //         },
    //         props: {},
    //     };
    // }

    return {
        props: {
            ekstrakurikuler: data
        },
    };
}