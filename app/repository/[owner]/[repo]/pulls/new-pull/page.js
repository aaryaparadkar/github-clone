"use client"
import styles from "../../../../../styles.module.css"
import Image from "next/image"
import merge from "../../../../../assets/merge.png"
import tick from "../../../../../assets/tick.png"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewPullReq() {
  const { owner, repo } = useParams()
  const [stakePrize, setStakePrize] = useState("")
  const [title, setTitle] = useState("")
  const [issueNumber, setIssueNumber] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleCreatePullRequest = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
  
    try {
      const token = localStorage.getItem("githubAccessToken")
      if (!token) {
        setError("Missing GitHub token")
        setLoading(false)
        return
      }
  
      // Construct the request body
      const requestBody = {
        title, // Required unless issue is specified
        head: "main", // jis branch mai change hai
        base: "master", // og branch ka name dalo
        body: description, // Optional
      }
  
      // If an issue number is provided, convert it to an integer and add it to the request body
      if (issueNumber) {
        requestBody.issue = parseInt(issueNumber, 10) // Convert issue number to integer
        delete requestBody.title // Remove title if issue is specified
        delete requestBody.body // Remove body if issue is specified
      }
  
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(requestBody),
      })
  
      console.log("Response:", response)
  
      if (!response.ok) {
        const errorData = await response.json(); // Log error details
        console.log("Error Details:", errorData)
        throw new Error("Failed to create pull request")
      }
  
      const data = await response.json()
      console.log("Pull Request Created: ", data)
      setSuccess(true)
    } catch (err) {
      console.log("Error:", err)
      setError(err.message)
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>
          <Image
            style={{ transform: "rotate(90deg)" }}
            src={merge}
            width={30}
            height={30}
          />
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>
          <div
            style={{
              color: "#40bf63",
              display: "flex",
              justifyContent: "center",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image src={tick} width={30} height={30} />
            Able to Merge
          </div>
        </div>

        <div>
          Set Stake Prize (minimum 0.1 ETH) <br />
          <input
            type="number"
            placeholder="ETH Prize"
            value={stakePrize}
            onChange={(e) => setStakePrize(e.target.value)}
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
          Add Title<br />
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
          Fix Issue Number <br />
          <input
            placeholder="#<Number>"
            value={issueNumber}
            onChange={(e) => setIssueNumber(e.target.value)}
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
          Add Description<br />
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

        <div>
          <button
            className={styles.ForkButton}
            style={{ width: 200 }}
            onClick={handleCreatePullRequest}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Pull Request"}
          </button>
        </div>

        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {success && <div style={{ color: "green" }}>Pull Request Created Successfully!</div>}
      </div>
    </>
  )
}
