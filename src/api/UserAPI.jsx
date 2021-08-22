import axiosClient from "./axiosClient";

const UserAPI = {

    postUser: (body) => {
        const url = '/user'
        return axiosClient.post(url, body)
    },
    postLogin: (body) => {
        const url = '/user/login'
        return axiosClient.post(url, body)
    },
    getDetail: (id) => {
        const url = `/user/${id}`
        return axiosClient.get(url)
    },
    patchUser: (body) => {
        const url = '/user'
        return axiosClient.patch(url, body)
    },
    patchImage: (body) => {
        const url = '/user/image'
        return axiosClient.patch(url, body)
    }

}

export default UserAPI