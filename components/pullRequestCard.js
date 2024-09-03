"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import profile from "../app/assets/profile1.jpg"
import raise from "../app/assets/raise.png"
import remove from "../app/assets/remove.png"
import Image from "next/image"
import styles from "../app/styles.module.css"

export default function PullReqCard() {
  const { owner, repo, issue, pull } = useParams()
  console.log(owner, repo, issue, pull)

  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [linkedPrs, setLinkedPrs] = useState([]) // Array to store multiple PRs

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("githubAccessToken")
        if (!token) {
          console.error("GitHub access token not found.")
          return
        }

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
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchUser()

    const fetchLinkedPRs = async () => {
      try {
        const token = localStorage.getItem("githubAccessToken")
        if (!token) {
          console.error("GitHub access token not found.")
          return
        }
        if (issue) {
          const response = await fetch(
            `https://api.github.com/search/issues?q=is:pr+${issue}+repo:${owner}/${repo}`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          )
          const data = await response.json()
          console.log(typeof data)
          if (Array.isArray(data.items) && data.items.length > 0) {
            const prsData = await Promise.all(
              data?.items.map(async (item) => {
                const linkedResponse = await fetch(item.pull_request.url, {
                  headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                  },
                })
                return await linkedResponse.json()
              }),
            )
            console.log(prsData)
            setLinkedPrs(prsData)
          }
        } else if (pull) {
          const response = await fetch(
            `https://api.github.com/search/issues?q=is:pr+${pull}+repo:${owner}/${repo}`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          )
          const data = await response.json()
          console.log(typeof data)
          if (Array.isArray(data.items) && data.items.length > 0) {
            const prsData = await Promise.all(
              data?.items.map(async (item) => {
                const linkedResponse = await fetch(item.pull_request.url, {
                  headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github.v3+json",
                  },
                })
                return await linkedResponse.json()
              }),
            )
            console.log(prsData)
            setLinkedPrs(prsData)
          }
        } else {
          console.log("Error at pr card")
        }
      } catch (error) {
        console.log("Error fetching linked PR data:", error)
      }
    }

    fetchLinkedPRs()
  }, [issue, pull, repo, owner])

  const dataToDisplay =
    Array.isArray(linkedPrs) && linkedPrs.length > 0 ? linkedPrs : []
  console.log(typeof dataToDisplay)
  console.log(dataToDisplay)

  return (
    <>
      {dataToDisplay?.length > 0 ? (
        dataToDisplay?.map((data, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 7,
              marginRight: 10,
              backgroundColor: "var(--button)",
              border: "0.5px solid var(--divider)",
              marginBottom: 10, // Added some spacing between each card
            }}
          >
            <Image
              className={styles.ProfileImg}
              src={profile}
              width={70}
              height={70}
            />

            <div
              style={{
                display: "flex",
                padding: 10,
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ color: "var(--aqua)" }}>
                {data.user ? data.user.login : ""}
              </div>
              <div>
                Staked
                <span
                  style={{
                    border: "0.5px solid var(--divider)",
                    backgroundColor: "rgba(8, 0, 42, 0.389)",
                    color: "var(--aqua)",
                    padding: 5,
                    margin: "0 10px",
                    fontSize: 20,
                  }}
                >
                  5 ETH
                </span>
                <span
                  style={{
                    marginRight: 5,
                    backgroundColor: data.state === "open" ? "green" : "red",
                    padding: 2,
                    color: "white",
                  }}
                >
                  {data.state}
                </span>
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
              </div>
              <div style={{ fontSize: 12, color: "grey" }}>
                {data.created_at
                  ? new Date(data.created_at).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <div style={{ color: "var(--aqua)", paddingRight: 10 }}>
                  #{data.number || ""}
                </div>
                {data.title || ""}
              </div>

              <div>
                {data.state === "closed" ? (
                  <div style={{ color: "var(--aqua)" }}> Merged </div>
                ) : (
                  <button className={styles.ForkButton}>Merge</button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ justifyContent: "center", display: "grid" }}>
          No linked pull requests found.
        </div>
      )}
      {/* <div>No linked pull requests or conversations found.</div> */}
    </>
  )
}
