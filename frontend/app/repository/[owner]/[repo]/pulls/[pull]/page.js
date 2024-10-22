"use client"
import styles from "../../../../../styles.module.css"
import DiscussionCard from "@/components/discussioncard"
import PullReqCard from "@/components/pullRequestCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Pull() {
  const { owner, repo, pull } = useParams()
  const [pullDetails, setPullDetails] = useState(null)
  const [comments, setComments] = useState([])
  const [commits, setCommits] = useState([])
  const [filesChanged, setFilesChanged] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPullDetails = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access token not found.")
          return
        }
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${pull}`, {
          headers: {
            Authorization: `token ${LStoken}`,
          }
        }
        )
        if (!response.ok) {
          throw new Error("Failed to fetch pull request details")
        }
        const data = await response.json()
        setPullDetails(data)

        // Fetch comments, commits, and files
        const commentsResponse = await fetch(data.comments_url)
        setComments(await commentsResponse.json())

        const commitsResponse = await fetch(data.commits_url)
        setCommits(await commitsResponse.json())

        const filesResponse = await fetch(`${data.url}/files`)
        setFilesChanged(await filesResponse.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPullDetails()
  }, [owner, repo, pull])

  if (loading) return <p>Loading pull request details...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          padding: "10px 3rem 0 3rem",
          fontSize: 24,
        }}
      >
        <div style={{ color: "var(--aqua)", paddingRight: 10 }}>
          #{pullDetails.number}
          <span
            style={{
              paddingLeft: 5,
              marginLeft: 5,
              fontSize: 16,
              color: "var(--font)",
              backgroundColor: "green",
              padding: 2,
            }}
          >
            {pullDetails.state}
          </span>
        </div>
        <div style={{ color: "var(--aqua)", paddingLeft: 10 }}>
          {pullDetails.title}
        </div>
      </div>

      <div
        style={{
          padding: "10px 3rem",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        Staked{" "}
        <div
          style={{
            border: "0.5px solid var(--divider)",
            backgroundColor: "rgba(8, 0, 42, 0.389)",
            color: "var(--aqua)",
            padding: 5,
            marginLeft: 5,
            marginRight: 5,
            fontSize: 20,
          }}
        >
          5 ETH
        </div>
        -
        <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 3 }}>
          {pullDetails.user.login}
        </div>
        wants to merge {pullDetails.commits} commit(s) into
        <div
          style={{
            backgroundColor: "rgba(8, 0, 42, 0.389)",
            color: "var(--aqua)",
            padding: 5,
            marginLeft: 3,
          }}
        >
          {pullDetails.base.ref}
        </div>
        from
        <div
          style={{
            backgroundColor: "rgba(8, 0, 42, 0.389)",
            color: "var(--aqua)",
            padding: 5,
            marginLeft: 3,
          }}
        >
          {pullDetails.head.ref}
        </div>
      </div>

      <div
        style={{
          height: 0.1,
          marginLeft: "3%",
          width: "94vw",
          backgroundColor: "var(--divider)",
        }}
      ></div>

      <div className={styles.IssueContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "var(--aqua)",
          }}
        >
          Conversations
        </div>

        <div
          style={{
            height: "auto",
            width: 0.1,
            gridColumnStart: 2,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 100,
            backgroundColor: "var(--divider)",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "var(--aqua)",
          }}
        >
          Commits({commits.length})
        </div>

        <div
          style={{
            height: "auto",
            width: 0.1,
            gridColumnStart: 4,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 4,
            backgroundColor: "var(--divider)",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "var(--aqua)",
          }}
        >
          Files Changed({filesChanged.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <DiscussionCard comments={comments} pullDetails={pullDetails} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PullReqCard />
        </div>

        <div
          style={{
            paddingLeft: 40,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <ol>
            {filesChanged.map((file) => (
              <li key={file.filename}>{file.filename}</li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}