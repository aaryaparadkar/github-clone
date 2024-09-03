"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import CommentCard from "@/components/CommentCard"
import styles from "../../../../../styles.module.css"
import DescriptionCard from "@/components/descriptionCard"
// import PostSolution from "@/components/postComment"
import PullReqCard from "@/components/pullRequestCard"
import Image from "next/image"
import raise from "../../../../../assets/raise.png"
import remove from "../../../../../assets/remove.png"

export default function Issue() {
  const { owner, repo, issue } = useParams()
  console.log(owner, repo, issue)

  const [issueBody, setIssues] = useState(null)
  const [authenticatedUser, setAuthenticatedUser] = useState(null)

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const token = localStorage.getItem("githubAccessToken")
        if (!token) {
          console.error("GitHub access token not found.")
          return
        }

        // Fetch authenticated user info
        const userResponse = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${token}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setAuthenticatedUser(userData.login)
        } else {
          console.error("Failed to fetch user info:", userResponse.statusText)
        }

        // Fetch specific issue details for the repository
        const issueResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          },
        )

        if (issueResponse.ok) {
          const data = await issueResponse.json()
          console.log(data)
          setIssues(data)
        } else {
          console.log("Failed to fetch issue:", issueResponse.statusText)
        }
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchIssue()
  }, [owner, repo, issue])

  return (
    <>
      {issueBody ? (
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
              #{issueBody.number}
              {issueBody.state === "open" ? (
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
                  {issueBody.state}
                </span>
              ) : (
                <span
                  style={{
                    paddingLeft: 5,
                    marginLeft: 5,
                    fontSize: 16,
                    color: "var(--font)",
                    backgroundColor: "red",
                    padding: 2,
                  }}
                >
                  {issueBody.state}
                </span>
              )}
            </div>
            {issueBody.title}
          </div>
          <div
            style={{
              padding: "10px 3rem",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            Win Prize
            <div
              style={{
                border: "0.5px solid var(--divider)",
                backgroundColor: "rgba(8, 0, 42, 0.389)",
                color: "var(--aqua)",
                padding: 5,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 20,
              }}
            >
              0.4 ETH
            </div>
            <Image
              style={{ marginRight: 5 }}
              src={raise}
              width={30}
              height={30}
            />
            <Image
              style={{ marginRight: 15 }}
              src={remove}
              width={30}
              height={30}
            />
            - Highest Stake by{" "}
            <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}>
              {issueBody?.user.login}
            </div>
            <div
              style={{
                border: "0.5px solid var(--divider)",
                backgroundColor: "rgba(8, 0, 42, 0.389)",
                color: "var(--aqua)",
                padding: 5,
                marginLeft: 10,
                marginRight: 30,
                fontSize: 20,
              }}
            >
              9.6 ETH
            </div>
            - Opened on {new Date(issueBody.created_at).toLocaleDateString()} by
            <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}>
              {issueBody?.user.login}
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
              Description
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
              Comments
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
              Linked Pull Requests
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <DescriptionCard issue={issueBody} />
              {/* <PostComment /> */}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CommentCard comments_url={issueBody.comments_url} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <PullReqCard />
            </div>
          </div>
        </>
      ) : (
        <div>Loading issue...</div>
      )}
    </>
  )
}
