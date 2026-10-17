import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { apiRequest } from "../api"
import { useAuth } from "../context/AuthContext"
import GoogleAuthButton from "../components/GoogleAuthButton"

function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsSubmitting(true)

    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
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

    <main className="signup-page">

      <div className="signup-container">

        <div className="signup-header">
          <p className="signup-label">CREATE YOUR ACCOUNT</p>

          <h1>Get started with SignWyz.</h1>

          <p>
            Create an account to start analyzing your
            contracts and legal documents.
          </p>
        </div>


        <form className="signup-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="firstName">First name</label>

            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="lastName">Last name</label>

            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>


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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
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

          <button type="submit" className="signup-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="google-divider">
            <span>or</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleAuthButton onError={setError} />
          </div>

        </form>


        <p className="signin-text">
          Already have an account?{" "}
          <Link to="/signin">Sign in</Link>
        </p>

      </div>

    </main>
  )
}

export default SignUp
