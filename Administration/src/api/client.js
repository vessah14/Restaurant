// Configuration du client HTTP pour communiquer avec le backend

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://restaurant-sxxt.onrender.com";

export const resolveMediaUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  return `${API_BASE_URL.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;
};

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("adminToken");
  }

  setToken(token) {
    this.token = token || null;

    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }

  getToken() {
    const token = localStorage.getItem("adminToken");

    this.token = token || null;

    return this.token;
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  getAuthHeaders() {
    const headers = {};

    const token = this.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async request(method, endpoint, data = null, multipart = false) {
    const url = `${this.baseURL}${endpoint}`;

    const options = {
      method,
      headers: multipart ? this.getAuthHeaders() : this.getHeaders(),
    };

    if (multipart) {
      // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
      delete options.headers["Content-Type"];
    }

    if (data !== null && data !== undefined) {
      options.body = multipart ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        if (response.status === 401) {
          this.setToken(null);
          window.dispatchEvent(new Event("auth:unauthorized"));
        }

        const validationErrors = errorData.errors
          ? Object.values(errorData.errors).flat().join(" ")
          : "";

        throw new Error(
          errorData.message ||
            errorData.error ||
            validationErrors ||
            errorData.title ||
            `Erreur HTTP ${response.status}`,
        );
      }

      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        return text;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Erreur API: ${method} ${url}`, error);

      throw error;
    }
  }

  get(endpoint) {
    return this.request("GET", endpoint);
  }

  post(endpoint, data) {
    return this.request("POST", endpoint, data);
  }

  put(endpoint, data) {
    return this.request("PUT", endpoint, data);
  }

  patch(endpoint, data) {
    return this.request("PATCH", endpoint, data);
  }

  delete(endpoint) {
    return this.request("DELETE", endpoint);
  }

  upload(endpoint, formData) {
    return this.request("POST", endpoint, formData, true);
  }

  postFormData(endpoint, formData) {
    return this.request("POST", endpoint, formData, true);
  }

  putFormData(endpoint, formData) {
    return this.request("PUT", endpoint, formData, true);
  }
}

export const api = new ApiClient();
