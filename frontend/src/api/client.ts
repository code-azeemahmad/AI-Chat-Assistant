// src/api/client.ts

import axios, {
    type AxiosInstance,
} from "axios";

import { config } from "../lib/config";

/**
 * Shared Axios client used for all
 * non-streaming HTTP requests.
 */
export const apiClient: AxiosInstance =
    axios.create({
        baseURL: config.apiUrl,

        timeout: 30_000,

        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });