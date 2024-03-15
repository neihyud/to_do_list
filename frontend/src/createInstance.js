/* eslint-disable no-console */
import axios from "axios";
import LocalStorageService from "./service/LocalStorageService";

const BASE_URL = "http://127.0.0.1:8080";

const createAxiosJwt = () => {
	const instance = axios.create({
		baseURL: BASE_URL,
		timeout: 10000,
	});

	instance.interceptors.request.use(
		(config) => {
			const token = LocalStorageService.getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response) {
				if (error.response.status === 401 || error.response.status === 403) {
				// To do force sign out
					console.error("Forbidden: You do not have permission to access this resource.");
					LocalStorageService.removeToken();
					window.location.href("/login");
				} else {
					console.error("Error:", error?.response?.data);
					console.log("error === ", error);
				}
			}
			return Promise.reject(error);
		}
	);

	return instance;

};

const createAxios = () => {
	const instance = axios.create({
		baseURL: BASE_URL,
		timeout: 10000,
	});

	return instance;
};

export { createAxios, createAxiosJwt };
