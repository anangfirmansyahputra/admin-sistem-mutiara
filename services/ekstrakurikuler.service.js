import http from "@/plugin/https";

const ekstrakurikulerService = {
    async delete(ids) {
        const { data } = await http.post("/ekstrakurikuler/delete", { ids: ids });

        return data;
    },

    async create(payload) {
        const { data } = await http.post('/ekstrakurikuler', payload)

        return data
    },

    async find(id) {
        const { data } = await http.get(`/ekstrakurikuler/${id}`)

        return data
    },

    async update(id, payload) {
        const { data } = await http.put(`/ekstrakurikuler/${id}`, payload)

        return data
    },

    async deleteOne(id) {
        const { data } = await http.delete(`/ekstrakurikuler/${id}`)

        return data
    },

    async get() {
        const { data } = await http.get(`/pengajar/ekstrakurikuler`)

        return data
    }
};

export default ekstrakurikulerService;
