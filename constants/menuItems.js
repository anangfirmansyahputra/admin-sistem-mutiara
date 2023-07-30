import { AppstoreAddOutlined, BellOutlined, CalendarOutlined, CameraOutlined, CarryOutOutlined, CrownOutlined, FileSearchOutlined, FolderOutlined, PieChartOutlined, ReconciliationOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const items = [
    {
        label: "Dashboard",
        key: "/secure/dashboard",
        icon: <PieChartOutlined />,
    },
    {
        label: "Pengajar",
        key: "/secure/pengajar",
        icon: <ReconciliationOutlined />,
    },
    {
        label: "Ekstrakurikuler",
        key: "/secure/ekstrakurikuler",
        icon: <CalendarOutlined />,
    },
    {
        label: "Siswa",
        key: "/secure/siswa",
        icon: <UsergroupAddOutlined />,
    },
    {
        label: "Absensi",
        key: "/secure/absensi",
        icon: <CarryOutOutlined />,
    },
    {
        label: "Pengumuman",
        key: "/secure/pengumuman",
        icon: <BellOutlined />,
    },
    {
        label: "Kelas",
        key: "/secure/kelas",
        icon: <AppstoreAddOutlined />,
    },
    {
        label: "Prestasi",
        key: "/secure/prestasi",
        icon: <CrownOutlined />,
    },
    {
        label: "Gallery",
        key: "/secure/gallery",
        icon: <CameraOutlined />,
    },
    {
        label: "Pelajaran",
        key: "/secure/matpel",
        icon: <FileSearchOutlined />,
    },
];

export default items;
