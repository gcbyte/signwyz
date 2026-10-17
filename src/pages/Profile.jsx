import { useRef, useState } from "react"
import { apiRequest, apiUpload, API_BASE_URL } from "../api"
import { useAuth } from "../context/AuthContext"


function Profile() {
  const { user, isLoadingUser, updateUser } = useAuth()

  const [avatarError, setAvatarError] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  const fileInputRef = useRef(null)

  const firstName = user?.first_name || ""
  const lastName = user?.last_name || ""
  const email = user?.email || ""
  const avatarUrl = user?.avatar_url ? `${API_BASE_URL}${user.avatar_url}` : ""
  const initial = (firstName || email || "U").charAt(0).toUpperCase()

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setAvatarError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const updatedUser = await apiUpload("/users/me/avatar", formData)
      updateUser(updatedUser)
    } catch (err) {
      setAvatarError(err.message)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const updatedUser = await apiRequest("/users/me/avatar", { method: "DELETE" })
      updateUser(updatedUser)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setAvatarError(err.message)
    }
  }

  const startEditing = () => {
    setEditFirstName(firstName)
    setEditLastName(lastName)
    setSaveError("")
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      setSaveError("First and last name can't be empty.")
      return
    }

    setIsSaving(true)
    setSaveError("")

    try {
      const updatedUser = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
        }),
      })
      updateUser(updatedUser)
      setIsEditing(false)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingUser) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <div className="profile-header">
          <p className="profile-label">YOUR ACCOUNT</p>
          <h1>Profile</h1>
          <p>Manage your account information and preferences.</p>
        </div>

        <section className="profile-card">

          <div className="profile-avatar-section">

            <div className="profile-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="profile-avatar-image" />
              ) : (
                initial
              )}
            </div>

            <div className="profile-avatar-actions">

              <button
                type="button"
                className="profile-avatar-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? "Change photo" : "Upload photo"}
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  className="profile-avatar-remove"
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="profile-avatar-input"
                aria-label="Upload profile photo"
              />

              {avatarError && <p className="file-error">{avatarError}</p>}

            </div>

          </div>

          <div className="profile-info">

            {!user && (
              <p className="profile-field-empty">
                We couldn't load your profile. Please try signing in again.
              </p>
            )}

            {isEditing ? (
              <>
                <div className="profile-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="profile-edit-input"
                  />
                </div>

                <div className="profile-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="profile-edit-input"
                  />
                </div>

                <div className="profile-field">
                  <span>Email Address</span>
                  <p>{email || "—"}</p>
                </div>

                {saveError && <p className="file-error">{saveError}</p>}

                <div className="profile-edit-actions">
                  <button
                    type="button"
                    className="profile-avatar-upload"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="profile-avatar-remove"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-field">
                  <span>First Name</span>
                  <p>{firstName || "—"}</p>
                </div>

                <div className="profile-field">
                  <span>Last Name</span>
                  <p>{lastName || "—"}</p>
                </div>

                <div className="profile-field">
                  <span>Email Address</span>
                  <p>{email || "—"}</p>
                </div>

                {user && (
                  <button
                    type="button"
                    className="profile-avatar-upload"
                    onClick={startEditing}
                  >
                    Edit Profile
                  </button>
                )}
              </>
            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Profile
