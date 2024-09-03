"use client"
import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import styles from "../../../../styles.module.css"
import { useParams } from "next/navigation"

export default function Issues() {
  const { owner, repo } = useParams()
  console.log(owner + repo)
  const [issues, setIssues] = useState([])
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIssues, setFilteredIssues] = useState([])

  useEffect(() => {
    const fetchIssues = async () => {
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

        let page = 1
        let allIssues = []
        let issuesResponse

        do {
          issuesResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues?page=${page}`,
            {
              headers: {
                Authorization: `token ${token}`,
              },
            },
          )

          if (issuesResponse.ok) {
            const data = await issuesResponse.json()
            allIssues = allIssues.concat(data)
            page++
          } else {
            console.error("Failed to fetch issues:", issuesResponse.statusText)
            break
          }
        } while (
          issuesResponse.ok &&
          issuesResponse.headers.get("Link")?.includes('rel="next"')
        )

        const issuesAndLinkedPRs = allIssues.filter(
          (issue) => !issue.pull_request && issue.state === "open",
        )

        setIssues(issuesAndLinkedPRs)
        setFilteredIssues(issuesAndLinkedPRs)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchIssues()
  }, [owner, repo])

  // Debounce function to delay search input processing
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleSearchChange = useCallback(
    debounce((query) => {
      setSearchQuery(query)
      if (query) {
        const lowercasedQuery = query.toLowerCase()
        setFilteredIssues(
          issues.filter(
            (issue) =>
              issue.title.toLowerCase().includes(lowercasedQuery) ||
              issue.body?.toLowerCase().includes(lowercasedQuery),
          ),
        )
      } else {
        setFilteredIssues(issues) // Reset to all issues if search query is empty
      }
    }, 300),
    [issues],
  )

  const handleCloseIssue = async (issueNumber) => {
    try {
      const token = localStorage.getItem("githubAccessToken")
      if (!token) {
        console.log("GitHub access token not found.")
        return
      }
      console.log("token", token)
      console.log("issueNo", issueNumber)

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "closed", // Close the issue
          }),
        },
      )

      console.log(response)
      if (response.ok) {
        // Filter out the closed issue from both states
        setIssues((prevIssues) =>
          prevIssues.filter((issue) => issue.number !== issueNumber),
        )
        setFilteredIssues((prevFilteredIssues) =>
          prevFilteredIssues.filter((issue) => issue.number !== issueNumber),
        )
        console.log(`Issue #${issueNumber} closed successfully.`)
      } else {
        const errorData = await response.json()
        console.log(
          "Failed to close issue:",
          response.status,
          response.statusText,
          errorData,
        )
      }
    } catch (error) {
      console.log("Error closing issue:", error)
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: "20px 30px",
          gap: 50,
        }}
      >
        <div>
          Highest Stake{" "}
          <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 ETH</div>
        </div>
        <div>
          <input
            placeholder="Type to Search..."
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "450px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
        </div>
        <div>
          <Link href={`/repository/${owner}/${repo}/issues/new-issue`}>
            <button className={styles.ForkButton}>New Issue</button>
          </Link>
        </div>
      </div>
      <div className={styles.IssuesTable}>
        {filteredIssues.length === 0 ? (
          <div style={{ color: "var(--font)", padding: "20px" }}>
            No issues found
          </div>
        ) : (
          <>
            <div style={{ color: "var(--aqua)" }}>
              {filteredIssues.length} open issues
            </div>
            <div style={{ color: "var(--aqua)" }}>Win Prize</div>
            <div style={{ color: "var(--aqua)" }}>Milestones</div>
            <div style={{ color: "var(--aqua)" }}>Assignee</div>
            <div style={{ color: "var(--aqua)" }}>Stakes</div>
            <div style={{ color: "var(--aqua)" }}>Close</div>

            <div
              style={{
                height: 0.1,
                gridColumnStart: 1,
                gridColumnEnd: 7,
                backgroundColor: "var(--divider)",
              }}
            ></div>

            {filteredIssues.map((issue) => (
              <React.Fragment key={issue.id}>
                <div
                  style={{
                    paddingLeft: 20,
                    display: "flex",
                    margin: 0,
                    flexDirection: "column",
                    justifyContent: "left",
                  }}
                >
                  <Link
                    href={`/repository/${owner}/${repo}/issues/${issue.number}`}
                  >
                    <span style={{ color: "var(--aqua)", fontSize: 20 }}>
                      #{issue.number}
                    </span>
                  </Link>
                  <Link
                    href={`/repository/${owner}/${repo}/issues/${issue.number}`}
                  >
                    <span>{issue.title}</span>
                  </Link>
                  <div>
                    {issue.labels.map((label) => (
                      <span
                        key={label.id}
                        style={{
                          backgroundColor: `#${label.color}`,
                          color: "#fff",
                          padding: "2px 5px",
                          borderRadius: "5px",
                          marginRight: "5px",
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>5 ETH</div>
                <div>
                  {issue.milestone ? issue.milestone.title : "No milestone"}
                </div>
                <div>
                  {issue.assignee ? issue.assignee.login : "No assignee"}
                </div>
                <div>5</div>
                <div>
                  <button
                    className={styles.ForkButton}
                    onClick={() => handleCloseIssue(issue.number)}
                    disabled={authenticatedUser !== owner}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{
                    height: 0.1,
                    gridColumnStart: 1,
                    gridColumnEnd: 7,
                    backgroundColor: "var(--divider)",
                  }}
                ></div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </>
  )
}
