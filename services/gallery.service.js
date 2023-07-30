import http from "@/plugin/https";

const galleryService = {
    async create(payload) {
        const { data } = await http.post("/gallery", payload);

        return data;
    },

    async update(payload, id) {
        const { data } = await http.put(`/gallery/${id}`, payload);

        return data;
    },

    async delete(ids) {
        const { data } = await http.post("/gallery/delete", ids);

        return data;
    },

    async get() {
        const { data } = await http.get('/gallery')

        return data
    },

    async deleteOne(id) {
        const { data } = await http.delete(`/gallery/${id}`)

        return data
    },
};

export default galleryService;
