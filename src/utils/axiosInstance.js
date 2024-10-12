import axios from "axios";

const apiClient = axios.create({
    baseURL:"http://localhost:8087"
})

apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); 
      if (token) {
        config.headers['authorization'] = `Bearer ${token}`;  
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const axiosInstance = apiClient  



export const getError =(error)=>{
    return {message : error.response.data.message,isError : error.response.data.error}
}