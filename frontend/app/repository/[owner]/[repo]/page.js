// app/repository/[owner]/[repo]/page.js
"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import styles from "../../../styles.module.css"

export default function Repository({}) {
  const { owner, repo } = useParams()
  const [commitDetails, setCommitDetails] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (owner && repo) {
      const fetchCommitDetails = async () => {
        try {
          const token = localStorage.getItem("githubAccessToken")
          if (!token) {
            setError("Missing token")
            return
          }

          const commitsResponse = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits`,
            {
              headers: {
                Authorization: `token ${token}`,
              },
            },
          )

          const commits = commitsResponse.data

          const detailedCommits = await Promise.all(
            commits.map(async (commit) => {
              const commitDetailsResponse = await axios.get(
                `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`,
                {
                  headers: {
                    Authorization: `token ${token}`,
                  },
                },
              )
              return commitDetailsResponse.data
            }),
          )

          setCommitDetails(detailedCommits)
        } catch (error) {
          console.log("Error fetching commit details:", error)
          setError("Failed to fetch commit details")
        }
      }

      fetchCommitDetails()
    }
  }, [owner, repo])

  return (
    <>
      <div className={styles.CodeTable}>
        <div style={{ color: "var(--aqua)" }}>FileName</div>
        <div style={{ color: "var(--aqua)" }}>Commit Message</div>

        {commitDetails.length > 0 ? (
          commitDetails.map((commit) => (
            <React.Fragment key={commit.sha}>
              {commit.files &&
                commit.files.map((file) => (
                  <React.Fragment key={file.filename}>
                    <div>{file.filename}</div>
                    <div>{commit.commit.message}</div>
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))
        ) : (
          <p>{error || "No commits or files found in the repository."}</p>
        )}
      </div>
    </>
  )
}
