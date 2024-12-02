
import axios from 'axios'
import { toast } from "react-toastify";
import { interceptorLoadingElements } from '~/utils/formatters'
let authorizeAxiosInstance = axios.create({})
// thời gian tối đa chờ request: để tầm 10 phút1

authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 100

// withCredentials: sẽ cho phép axios gửi cookie trong request
authorizeAxiosInstance.defaults.withCredentials = true

authorizeAxiosInstance.interceptors.request.use(function (config) {
    // kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    interceptorLoadingElements(false)
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    interceptorLoadingElements(false)
    let errorMessage = error?.response
    if (error.response?.data?.message) {
        errorMessage = error.response.data.message
        if (error.response?.status !== 410) {   // 410: MÃ GONE
            toast.error(errorMessage)
        }
    }
    return Promise.reject(error);
});
export default authorizeAxiosInstance
