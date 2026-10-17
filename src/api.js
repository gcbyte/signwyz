const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function handleSessionExpired() {
  localStorage.removeItem("token")
  window.location.href = "/signin"
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // A 401 on an /auth/* endpoint means "wrong credentials," not "your
  // session expired" — there's no session to expire yet. Only treat 401
  // as a session-expiry event for already-authenticated requests.
  const isAuthEndpoint = path.startsWith("/auth/")

  if (response.status === 401 && !isAuthEndpoint) {
    handleSessionExpired()
    throw new Error("Your session has expired. Please sign in again.")
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || "Something went wrong. Please try again.")
  }

  return response.json()
}

/**
 * Multipart/form-data upload wrapper. Omits Content-Type so the browser
 * sets the correct multipart boundary automatically.
 */
async function apiUpload(path, formData) {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (response.status === 401) {
    handleSessionExpired()
    throw new Error("Your session has expired. Please sign in again.")
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || "Something went wrong. Please try again.")
  }

  return response.json()
}

export { apiRequest, apiUpload, API_BASE_URL }