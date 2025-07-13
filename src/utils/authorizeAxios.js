
import axios from 'axios'
import { toast } from "react-toastify";
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { loggoutUserAPI } from '~/redux/user/userSlice';

let axiosReduxStore
export const injectStore = mainStore => {
    axiosReduxStore = mainStore
}
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

let refreshTokenPromise = null

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

    // xử lý refresh token tự động:
    // Trường hợp 1: Nếu như nhận mã 403 từ BE, thì gọi api đăng xuất
    if (error.response?.status === 401) {
        axiosReduxStore.dispatch(loggoutUserAPI(false))
    }
    // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì gọi api refresh token
    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
        // gán thêm một giá trị _retry = true vào originalRequests vì trong khoảng thời gian chờ request, nếu có lỗi 410 thì sẽ không gọi api refresh token
        originalRequests._retry = true
        if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokenAPI()
                .then(data => {
                    return data?.accessToken
                })
                .catch(() => {
                    // nếu nhận bất kỳ lỗi nào, thì sẽ logout
                    axiosReduxStore.dispatch(loggoutUserAPI(false))
                })
                .finally(() => {
                    // luôn gán refreshTokenPromise = null để có thể gọi api refresh token lại
                    refreshTokenPromise = null
                })
        }
        // eslint-disable-next-line no-unused-vars
        return refreshTokenPromise.then(accessToken => {
            /**  Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
            * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE)
            * sau khi api refrestfoken được gọi thành công.
            */

            // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests đe
            // gọi lại những api ban đầu bị lỗi
            return authorizeAxiosInstance(originalRequests)
        })
    }

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
