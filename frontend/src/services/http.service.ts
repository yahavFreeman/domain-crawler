// src/services/http.service.ts
import Axios from "axios";
import type { Method, AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_API_URL : "//localhost:3000/api/v1";

const axiosInstance = Axios.create({
  withCredentials: true,
});

type RequestData = Record<string, any> | null;

export const httpService = {
  get<T = any>(endpoint: string, data?: RequestData): Promise<T> {
    return ajax<T>(endpoint, "GET", data);
  },
  post<T = any>(endpoint: string, data?: RequestData): Promise<T> {
    return ajax<T>(endpoint, "POST", data);
  },
  put<T = any>(endpoint: string, data?: RequestData): Promise<T> {
    return ajax<T>(endpoint, "PUT", data);
  },
  delete<T = any>(endpoint: string, data?: RequestData): Promise<T> {
    return ajax<T>(endpoint, "DELETE", data);
  },
};

async function ajax<T = any>(
  endpoint: string,
  method: Method = "GET",
  data: RequestData = null
): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === "GET" ? data : undefined,
    };

    const res = await axiosInstance(config);
    return res.data as T;
  } catch (err: any) {
    console.error(
      `Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`,
      data
    );
    console.dir(err);
    throw err;
  }
}
