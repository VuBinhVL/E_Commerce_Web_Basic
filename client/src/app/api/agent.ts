/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (response: AxiosResponse) => response.data;
const sleep = () => new Promise(resolve => setTimeout(resolve, 300));

axios.interceptors.request.use(config => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

axios.interceptors.response.use(async response => {
  await sleep();
  const pagintaion = response.headers['pagination'];
  if (pagintaion) {
    response.data = new PaginatedResponse(response.data, JSON.parse(pagintaion));
    return response;
  }
  return response;
}, (error: AxiosError) => {
  const { data, status } = error.response as AxiosResponse;
  switch (status) {
    case 400:
      if (data.errors) {
        const modelStateErrors: string[] = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key]);
          }
        }
        throw modelStateErrors.flat();

      }
      toast.error(data.title);
      break;
    case 401:
      toast.error(data.title);
      break;
    case 404:
      toast.error(data.title);
      break;
    case 500:
      router.navigate("/server-error", { state: { error: data } });
      break;
    default:
      break;
  }
  return Promise.reject(error);
})
axios.defaults.withCredentials = true;

const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("product", params),
  details: (id: number) => requests.get(`product/${id}`),
  filters: () => requests.get("product/filters"),
};

const testErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  fetchSavedAddress: () => requests.get("account/savedAddress"),
}

const Orders = {
  list: () => requests.get("order"),
  fetch: (id: number) => requests.get(`order/${id}`),
  create: (values: any) => requests.post("order", values),
};

export const agent = {
  Catalog,
  testErrors,
  Basket,
  Account,
  Orders
};  
