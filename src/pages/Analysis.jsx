import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { apiRequest } from "../api"

function Analysis() {

  const { id: documentId } = useParams()
  const navigate = useNavigate()

  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!documentId) {
      setIsLoading(false)
      return
    }

    apiRequest(`/documents/${documentId}`)
      .then(setDocument)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [documentId])

  if (!documentId) {
    return (
      <main className="analysis-page">
        <div className="analysis-container">
          <div className="analysis-header">
            <p className="analysis-label">ANALYSIS RESULTS</p>
            <h1>Invalid link.</h1>
            <p>
              This URL doesn't include a document ID.
              Please return to the dashboard and analyze a document.
            </p>
          </div>
          <button className="analyze-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="analysis-page">
        <div className="analysis-container">
          <div className="analysis-header">
            <p className="analysis-label">ANALYSIS RESULTS</p>
            <h1>Loading your analysis...</h1>
          </div>
        </div>
      </main>
    )
  }

  if (error || !document) {
    return (
      <main className="analysis-page">
        <div className="analysis-container">
          <div className="analysis-header">
            <p className="analysis-label">ANALYSIS RESULTS</p>
            <h1>Something went wrong.</h1>
            <p>{error || "We couldn't load this document."}</p>
          </div>
          <button className="analyze-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </main>
    )
  }

  const findings = document.findings

  const risks = findings.filter((f) => f.risk !== "benefit")
  const benefits = findings.filter((f) => f.risk === "benefit")

  const highRiskCount = risks.filter((f) => f.risk === "high").length
  const mediumRiskCount = risks.filter((f) => f.risk === "medium").length
  const lowRiskCount = risks.filter((f) => f.risk === "low").length

  return (
    <main className="analysis-page">
      <div className="analysis-container">

        <div className="analysis-header">
          <p className="analysis-label">ANALYSIS RESULTS</p>
          <h1>
            {document.type === "contract" && "Contract analysis"}
            {document.type === "terms" && "Terms & Conditions analysis"}
            {document.type === "privacy" && "Privacy Policy analysis"}
            {document.type === "other" && "Legal document analysis"}
          </h1>
          <p>Here are the findings from your document.</p>
        </div>

        <section className="document-preview">
          <h2>Document Preview</h2>
          <p>{document.text}</p>
        </section>

        <section className="risk-summary">
          <h2>Risk Summary</h2>
          <div className="risk-levels">
            <div className="risk-card">
              <span>HIGH RISK</span>
              <strong>{highRiskCount}</strong>
            </div>
            <div className="risk-card">
              <span>MEDIUM RISK</span>
              <strong>{mediumRiskCount}</strong>
            </div>
            <div className="risk-card">
              <span>LOW RISK</span>
              <strong>{lowRiskCount}</strong>
            </div>
          </div>
        </section>

        <section className="analysis-overview">
  <h2>Overall Assessment</h2>
  <p>
    {risks.length === 0 && benefits.length === 0
      ? "No significant risks or notable benefits were identified in this analysis."
      : risks.length === 0
        ? "No significant risks were identified in this analysis. The findings below highlight terms that may be beneficial to you."
        : benefits.length === 0
          ? "Your document contains several clauses that may deserve closer attention. No notable benefits were identified in this analysis."
          : "Your document contains clauses that may deserve closer attention, as well as terms that may offer benefits to you. Review the findings below to understand both sides of the document."}
  </p>
</section>

        <section className="analysis-results">
  <div className="results-header">
    <h2>Risks & Obligations</h2>
    <p>Possible clauses and areas that may deserve your attention.</p>
  </div>

  {risks.length === 0 && (
    <p>No significant risks were identified in this document.</p>
  )}

  {risks.map((finding, index) => (
    <div
      className="finding-card"
      key={`risk-${finding.title}-${index}`}
    >
      <div className="finding-top">
        <span className={`finding-risk ${finding.risk}`}>
          {finding.risk.toUpperCase()} RISK
        </span>

        <span className="finding-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3>{finding.title}</h3>

      <p className="finding-description">
        {finding.description}
      </p>

      <div className="finding-details">
        <div>
          <span>Why it matters</span>
          <p>{finding.why_it_matters}</p>
        </div>

        <div>
          <span>What to review</span>
          <p>{finding.what_to_review}</p>
        </div>
      </div>
    </div>
  ))}
</section>


  <section className="analysis-results analysis-benefits">
    <div className="results-header">
      <h2>What You Stand to Gain</h2>
      <p>Advantages and favorable terms worth knowing about.</p>
    </div>

    {benefits.length === 0 && (
  <p>No notable benefits were identified in this document.</p>
)}

    {benefits.map((finding, index) => (
      <div
        className="finding-card finding-card-benefit"
        key={`benefit-${finding.title}-${index}`}
      >
        <div className="finding-top">
          <span className="finding-risk benefit">
            BENEFIT
          </span>

          <span className="finding-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3>{finding.title}</h3>

        <p className="finding-description">
          {finding.description}
        </p>

        <div className="finding-details">
          <div>
            <span>Why it matters</span>
            <p>{finding.why_it_matters}</p>
          </div>

          <div>
            <span>What to review</span>
            <p>{finding.what_to_review}</p>
          </div>
        </div>
      </div>
    ))}
  </section>


<button
  className="back-to-dashboard-button"
  onClick={() => navigate("/dashboard")}
>
  ← Back to Dashboard
</button>

      </div>
    </main>
  )
}

export default Analysis