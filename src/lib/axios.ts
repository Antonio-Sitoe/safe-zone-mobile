import axios from "axios";
import { env } from "./env";

console.log({ env: env.EXPO_PUBLIC_API_URL });

export const api = axios.create({
	baseURL: "http://10.103.62.99:3000",
});
