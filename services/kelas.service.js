import http from "@/plugin/https";

const kelasService = {
    async create(payload) {
        const { data } = await http.post("/kelas", payload);

        return data;
    },

    async edit(payload, id) {
        const { data } = await http.put(`/kelas/${id}`, payload);

        return data;
    },

    // async delete(ids) {
    //     const { data } = await http.post("/kelas/delete", ids);
    //     return data;
    // },

    async find(id) {
        const { data } = await http.get(`/kelas/${id}`)

        return data
    },

    async delete(id) {
        const { data } = await http.delete(`/kelas/delete/${id}`)

        return data
    },

    async get() {
        const { data } = await http.get(`/kelas`)

        return data
    },
};

export default kelasService;
