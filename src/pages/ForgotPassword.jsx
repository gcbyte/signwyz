import { useState } from "react"
import { Link } from "react-router-dom"
import { apiRequest } from "../api"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setIsSubmitting(true)

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      setIsSent(true)
    } catch (err) {
      // Show a generic message — don't reveal whether the email exists
      setIsSent(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <main className="forgot-password-page">

      <div className="forgot-password-container">

        <div className="forgot-password-header">

          <p className="forgot-password-label">
            RESET YOUR PASSWORD
          </p>

          <h1>
            Forgot your password?
          </h1>

          <p>
            Enter your email address and we'll send you
            instructions to reset your password.
          </p>

        </div>

        {isSent ? (

          <p className="selected-file">
            If an account exists for {email}, we've sent password reset
            instructions to that address.
          </p>

        ) : (

          <form className="forgot-password-form" onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

            </div>

            {error && <p className="file-error">{error}</p>}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>

          </form>

        )}

        <p className="back-to-signin">
          Remember your password?{" "}
          <Link to="/signin">
            Sign in
          </Link>
        </p>

      </div>

    </main>

  )
}

export default ForgotPassword
