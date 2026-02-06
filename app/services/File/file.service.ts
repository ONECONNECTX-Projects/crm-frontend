const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://crm-quest.oneconnectx.com/api/";
const UPLOAD_BASE_URL = API_BASE_URL.replace("/api/", "");

export const getFileUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${UPLOAD_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
