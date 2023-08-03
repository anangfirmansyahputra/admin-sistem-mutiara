import { AppstoreAddOutlined, BellOutlined, CalendarOutlined, CameraOutlined, CarryOutOutlined, CrownOutlined, FileSearchOutlined, FolderOutlined, PieChartOutlined, ReconciliationOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const items = [
    {
        label: "Dashboard",
        key: "dashboard",
        icon: <PieChartOutlined />,
    },
    {
        label: "Pengajar",
        key: "pengajar",
        icon: <ReconciliationOutlined />,
    },
    {
        label: "Ekstrakurikuler",
        key: "ekstrakurikuler",
        icon: <CalendarOutlined />,
    },
    {
        label: "Siswa",
        key: "siswa",
        icon: <UsergroupAddOutlined />,
    },
    {
        label: "Absensi",
        key: "absensi",
        icon: <CarryOutOutlined />,
    },
    {
        label: "Pengumuman",
        key: "pengumuman",
        icon: <BellOutlined />,
    },
    {
        label: "Kelas",
        key: "kelas",
        icon: <AppstoreAddOutlined />,
    },
    {
        label: "Prestasi",
        key: "prestasi",
        icon: <CrownOutlined />,
    },
    {
        label: "Gallery",
        key: "gallery",
        icon: <CameraOutlined />,
    },
    {
        label: "Pelajaran",
        key: "matpel",
        icon: <FileSearchOutlined />,
    },
];

export default items;
