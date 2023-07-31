import http from '@/plugin/https'

const path = "/admin/pengumuman"

const pengumumanService = {
    async create(payload) {
        const { data } = await http.post(path, payload)

        return data
    },

    async find(id) {
        const { data } = await http.get(`${path}/${id}`)

        return data
    },

    async update(id, payload) {
        const { data } = await http.put(`${path}/${id}`, payload)

        return data
    },

    async delete(id) {
        const { data } = await http.delete(`${path}/${id}`)

        return data
    }
}

export default pengumumanService