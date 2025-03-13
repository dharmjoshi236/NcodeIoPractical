import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL;

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    validateStatus: (status)=> true
});

const postRequest = async (apiUrl, reqBody, headers={}) => {
    try {
        let response = await AxiosInstance.post(apiUrl, reqBody, headers);

        return response;
    } catch (error) {
        console.log('error in axios ', error);
        return error;
    }
}

const getRequest = async (apiUrl, isBlob)=> {
    try {
        let response;
        if (isBlob) {
            response = await AxiosInstance.get(apiUrl, {responseType: 'blob', headers: {
                "Content-Type": "application/pdf",
                "Accept":"application/pdf"
            }})
        } else {
            response = await AxiosInstance.get(apiUrl);
        }

        return response;
    } catch (error) {
        console.log('error in axios ', error);
        return error;
    }
}

export {
    postRequest,
    getRequest
}