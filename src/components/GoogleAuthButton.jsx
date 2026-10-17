import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../api"
import { useAuth } from "../context/AuthContext"

/**
 * Shared Google OAuth button used by both SignIn and SignUp.
 * Calls POST /auth/google, stores the token, and redirects to /dashboard.
 *
 * @param {{ onError: (msg: string) => void }} props
 */
function GoogleAuthButton({ onError }) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSuccess = async (credentialResponse) => {
    try {
      const data = await apiRequest("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })
      login(data.access_token)
      navigate("/dashboard")
    } catch (err) {
      onError(err.message)
    }
  }

  const handleError = () => {
    onError("Google sign-in failed. Please try again.")
  }

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
}

export default GoogleAuthButton
