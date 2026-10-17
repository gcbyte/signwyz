import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { apiRequest } from "../api"
import { useAuth } from "../context/AuthContext"
import GoogleAuthButton from "../components/GoogleAuthButton"

function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show a success message if redirected here after a password reset
  const successMessage = location.state?.message || ""

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

      login(data.access_token)
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

          {successMessage && <p className="selected-file">{successMessage}</p>}

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
            <GoogleAuthButton onError={setError} />
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
