"use client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import styles from "../../../../../styles.module.css"

export default function NewIssue() {
  const router = useRouter()
  const { owner, repo } = useParams()

  const [ethPrize, setEthPrize] = useState(0.1) // Default value 0.1 ETH
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCreateIssue = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("githubAccessToken")
      if (!token) {
        setError("GitHub access token not found.")
        setLoading(false)
        return
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body: description, // Only the description is included in the body
            labels: tags.split(",").map((tag) => tag.trim()), // Split tags into array and add as labels
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log("Issue created:", data)
        // You can handle the ETH prize separately here if needed
        router.push(`/repository/${owner}/${repo}/issues`)
      } else {
        setError("Failed to create issue.")
        console.error("Failed to create issue:", response.statusText)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error creating issue:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          padding: "30px 20%",
          gap: 30,
        }}
      >
        <div>
          Set Win Prize (minimum 0.1 ETH) <br />
          <input
            type="number"
            placeholder="ETH Prize"
            value={ethPrize}
            onChange={(e) => setEthPrize(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>
        <div>
          Add Title
          <br />
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          Add Tags (comma separated)
          <br />
          <input
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          Add Description
          <br />
          <textarea
            placeholder="Add your description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              minHeight: 150,
              color: "var(--font)",
              padding: "5px",
              width: "750px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button
            className={styles.ForkButton}
            onClick={handleCreateIssue}
            disabled={loading}
            style={{ width: 200 }}
          >
            {loading ? "Creating..." : "Create New Issue"}
          </button>
        </div>
      </div>
    </>
  )
}

// <table>
//     <thead>
//     19 open issues
//     </thead>
// </table>
