import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { apiRequest } from "../api"

function ResetPassword() {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, new_password: password }),
      })
      navigate("/signin", {
        state: { message: "Password reset. You can now sign in with your new password." },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <main className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <p className="reset-password-label">RESET YOUR PASSWORD</p>
            <h1>This reset link is invalid.</h1>
            <p>
              This link may be missing its reset token, expired, or already
              used. Please request a new password reset link.
            </p>
          </div>
          <button
            type="button"
            className="reset-password-button"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Link
          </button>
        </div>
      </main>
    )
  }

  return (

    <main className="reset-password-page">

      <div className="reset-password-container">

        <div className="reset-password-header">

          <p className="reset-password-label">
            RESET YOUR PASSWORD
          </p>

          <h1>
            Create a new password.
          </h1>

          <p>
            Enter a new password for your SignWyz account.
          </p>

        </div>


        <form className="reset-password-form" onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="password">
              New password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your new password"
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


          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          {error && <p className="file-error">{error}</p>}

          <button
            type="submit"
            className="reset-password-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

        </form>


        <p className="back-to-signin">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </p>

      </div>

    </main>

  )
}

export default ResetPassword
