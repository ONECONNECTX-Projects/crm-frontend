const API_BASE_URL =
  process.env.NEXT_PUBLIC_DATA_URL ||
  "https://cmsapi.oneconnectx.com/documents/views";

export interface ProductView {
  _id: string;
  email: string;
  mobile: string;
  context: string;
  all: boolean;
  ip: string;
  ua: string;
  created_at: string;

  // Updated to allow null since the first item in your JSON has "product_id": null
  product_id?: string | null;

  product?: {
    id: string;
    name: string;
    productType: string;
  };
}

export interface ProductViewsResponse {
  page: number;
  limit: number;
  total: number;
  views: ProductView[];
}

// You can keep ApiResponse if other endpoints use it,
// but we won't use it for this specific fetch function.
export interface ApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data: T;
}

/* =========================
   Get All Views (Paginated)
========================= */
// 1. Changed the return type to Promise<ProductViewsResponse>
export async function getAllViews(
  page: number = 1,
  limit: number = 20,
): Promise<ProductViewsResponse> {
  const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch views");
  }

  const data = await response.json();
  return data;
}
