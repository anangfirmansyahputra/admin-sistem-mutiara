import { useContext } from "react";
import { AdminContext } from "./index";
import { signIn } from "next-auth/react";

export default function useLoginContext() {
    const context = useContext(AdminContext);
    const [loading, setLoading] = context.loading;
    const [router] = context.router;
    const [api, contextHolder] = context.notification;

    const openNotification = () => {
        api.error({
            message: "Login gagal",
            description: "Username dan password anda salah, silahkan coba kembali",
        });
    };

    const handleLogin = (data) => {
        setLoading(true);

        const payload = { ...data, role: "admin" };

        signIn("credentials", {
            redirect: false,
            ...payload,
        })
            .then(({ ok, error }) => {
                if (ok) {
                    router.push("/secure/dashboard");
                } else {
                    openNotification();
                }
            })
            .finally(() => setLoading(false));
    };

    const handleLoginSiswa = (data) => {
        setLoading(true);

        const payload = { ...data, role: "siswa" };

        signIn("credentials", {
            redirect: false,
            ...payload,
        })
            .then(({ ok, error }) => {
                if (ok) {
                    router.push("/");
                } else {
                    openNotification();
                }
            })
            .finally(() => setLoading(false));
    };

    return {
        handleLogin,
        handleLoginSiswa,
        loading,
        contextHolder,
    };
}
