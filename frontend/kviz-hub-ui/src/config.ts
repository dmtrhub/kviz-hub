const defaultApiBaseUrl = "http://localhost:7033/api";
const defaultAvatarUrl = "http://localhost:7033";

const resolvedApiBaseUrl =
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_API_URL ||
	defaultApiBaseUrl;

const resolvedAvatarUrl =
	import.meta.env.VITE_AVATAR_URL ||
	defaultAvatarUrl;

export const API_BASE_URL = resolvedApiBaseUrl;
export const AVATAR_URL = resolvedAvatarUrl;