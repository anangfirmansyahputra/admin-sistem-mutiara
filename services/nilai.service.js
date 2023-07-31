import http from '@/plugin/https'

const path = '/ekstrakurikuler/nilai'

const nilaiService = {
    async beriNilai(id, payload) {
        const { data } = await http.post(`${path}/${id}`, payload)

        return data
    }
}

export default nilaiService