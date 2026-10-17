import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../api"

function Documents() {

  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    apiRequest("/documents")
      .then(setDocuments)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const openDocument = (document) => {
    navigate(`/analysis/${document.id}`)
  }

  if (isLoading) {
    return (
      <div className="documents-page">
        <h1>Documents</h1>
        <p>Loading your documents...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="documents-page">
        <h1>Documents</h1>
        <p className="file-error">{error}</p>
      </div>
    )
  }

  return (
    <div className="documents-page">

      <h1>Documents</h1>

      {documents.length === 0 ? (
        <p>No documents have been analyzed yet.</p>
      ) : (
        <div className="documents-list">

          {documents.map((document) => (

            <div
              className="document-card"
              key={document.id}
              role="button"
              tabIndex={0}
              onClick={() => openDocument(document)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openDocument(document)
                }
              }}
            >

              <h2>{document.name}</h2>

              <p>Type: {document.type}</p>

              <p>Analyzed: {new Date(document.created_at).toLocaleDateString()}</p>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default Documents