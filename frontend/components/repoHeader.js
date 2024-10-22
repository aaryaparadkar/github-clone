"use client"
import { useParams } from "next/navigation"
import styles from "../app/styles.module.css"
import Image from "next/image"
import fork from "../app/assets/fork.png"
import Link from "next/link"
import { useState } from "react"

export default function RepoHeader() {
  const { owner, repo } = useParams()
  const [repoName, setRepoName] = useState(repo)
  const [isForking, setIsForking] = useState(false)

  const handleFork = async () => {
    setIsForking(true)

    // Retrieve the GitHub access token from localStorage
    const token = localStorage.getItem("githubAccessToken")
    if (!token) {
      console.error("GitHub access token not found.")
      alert("Please login to your GitHub account.")
      setIsForking(false)
      return
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/forks`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        const forkedRepo = await response.json()
        alert(`Forked successfully! New repo: ${forkedRepo.full_name}`)
      } else {
        const errorData = await response.json()
        alert(`Failed to fork: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error during forking:", error)
      alert("An error occurred while forking the repository.")
    } finally {
      setIsForking(false)
    }
  }

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.HeaderChild1} style={{ gap: 10 }}>
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>

          <span style={{ color: "var(--aqua)" }}>{repo}</span>
        </div>
        <div className={styles.HeaderChild2}>
          <div>Code</div>
          <div>Discussions</div>
          <Link href={`/repository/${owner}/${repo}/issues`}>
            <div>Issues</div>
          </Link>
          <Link href={`/repository/${owner}/${repo}/pulls`}>
            <div>Pull Requests</div>
          </Link>

          {/* Fork button and input field */}
          <div style={{ display: "flex", gap: 3 }}>
            <Image src={fork} width={30} height={30} />
            <button
              className={styles.ForkButton}
              style={{ width: 70 }}
              onClick={handleFork}
              disabled={isForking}
            >
              {isForking ? "Forking..." : "Fork"}
            </button>
            <input
              style={{
                color: "var(--font)",
                padding: "0 5px",
                background: "var(--button)",
                border: "0.5px solid var(--divider)",
                fontSize: "14px",
              }}
              placeholder="Your Repo Name..."
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.Divider}></div>
    </>
  )
}
