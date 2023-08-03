import http from "@/plugin/https";

const siswaService = {
    async create(payload) {
        const { data } = await http.post("/siswa", payload);

        return data;
    },

    async edit(payload, id) {
        const { data } = await http.put(`/siswa/${id}/update`, payload);

        return data;
    },

    async delete(nis) {
        const { data } = await http.post("/siswa/delete", { nis: nis });

        return data;
    },

    async getById(id) {
        const { data } = await http.get(`/siswa/${id}`)

        return data
    },

    async deleteOne(id) {
        const { data } = await http.delete(`/siswa/${id}/delete`)

        return data
    },

    async find(id) {
        const { data } = await http.get(`siswa/${id}`)

        return data
    },

    async get() {
        const { data } = await http.get('/siswa')

        return data
    }
};

export default siswaService;
