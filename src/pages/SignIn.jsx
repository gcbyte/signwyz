import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import { apiRequest } from "../api"

function SignIn({ onAuthSuccess }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
  event.preventDefault()
  setError("")

  if (!email.trim() || !password.trim()) {
    setError("Please enter your email and password.")
    return
  }

  setIsSubmitting(true)

  try {
    const data = await apiRequest("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    localStorage.setItem("token", data.access_token)
    onAuthSuccess?.()
    navigate("/dashboard")
  } catch (err) {
    setError(err.message)
  } finally {
    setIsSubmitting(false)
  }
}

  return (

    <main className="signin-page">

      <div className="signin-container">

        <div className="signin-header">
          <p className="signin-label">WELCOME BACK</p>

          <h1>Sign in to SignWyz.</h1>

          <p>
            Sign in to continue analyzing your contracts
            and legal documents.
          </p>
        </div>


        <form className="signin-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          {error && <p className="file-error">{error}</p>}

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>


          <button type="submit" className="signin-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
          
          <div className="google-divider">
  <span>or</span>
</div>

<div className="google-login-wrapper">
<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      setError("")

      const data = await apiRequest("/auth/google", {
        method: "POST",
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      })

      localStorage.setItem("token", data.access_token)
      onAuthSuccess?.()
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }}
  onError={() => {
    setError("Google sign-in failed. Please try again.")
  }}
/>
</div>

        </form>


        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">Create an account</Link>
        </p>

      </div>

    </main>
  )
}

export default SignIn