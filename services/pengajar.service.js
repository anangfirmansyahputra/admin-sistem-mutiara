import http from "@/plugin/https";

const pengajarService = {
    async delete(niks) {
        const { data } = await http.post("/pengajar/delete", { niks });

        return data;
    },

    async create(payload) {
        const { data } = await http.post('admin/buat-pengajar', payload)

        return data
    },

    async find(id) {
        const { data } = await http.get(`admin/pengajar/${id}`)

        return data
    },

    async deleteOne(nik) {
        const { data } = await http.delete(`admin/pengajar/delete/${nik}`);

        return data;
    },

    async update(id, payload) {
        const { data } = await http.put(`/pengajar/${id}`, payload);

        return data;
    },


};

export default pengajarService;