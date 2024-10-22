"use client"
import React, { useState, useEffect, useCallback, useContext } from "react"
import Link from "next/link"
import styles from "../../../../styles.module.css"
import { useParams } from "next/navigation"
import Web3Context from "@/context/Web3Context"
import { ethers } from "ethers"
import { useRouter } from "next/navigation"

export default function Issues() {
  const { provider, account, stakingContract, token, chainId } =
    useContext(Web3Context)
  const router = useRouter()

  const { owner, repo } = useParams()
  console.log(owner, repo)

  let repoId
  const [repoidstate, setrepoidstate] = useState(0)

  const [issues, setIssues] = useState([])
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIssues, setFilteredIssues] = useState([])
  const [issueInfo, setIssueInfo] = useState({})

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access token not found.")
          return
        }
        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Authorization: `token ${LStoken}`,
            },
          },
        )
        if (repoResponse.ok) {
          const repoData = await repoResponse.json()
          repoId = repoData?.id
          setrepoidstate(repoData?.id)
        } else {
          console.error("Failed to fetch repo info:", repoResponse.statusText)
        }

        const userResponse = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setAuthenticatedUser(userData?.login)
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
                Authorization: `token ${LStoken}`,
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

        if (repoId) {
          for (const issue of issuesAndLinkedPRs) {
            const [winPrize, stakeCount, totalStakeAmount, creator, solved] =
              await getIssueInfo(repoId, issue.number)
            setIssueInfo((prev) => ({
              ...prev,
              [issue.number]: {
                prize: winPrize,
                stakeCount,
                totalStakeAmount,
                creator,
                solved,
              },
            }))
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchIssues()
  }, [owner, repo, account])

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
  const handleNewIssue = () => {
    if (authenticatedUser !== owner) {
      console.log(authenticatedUser, owner)
      console.log("Helle")
      alert("You do not have permission to create issue currently. Only the repository owner can create it.")
      return
    }
    router.push(`/repository/${owner}/${repo}/issues/new-issue`)
  }
  const handleCloseIssue = async (issueNumber) => {
    if (authenticatedUser !== owner) {
      alert("You do not have permission to close this issue. Only the repository owner can close it.")
      return
    }
    const userResponse = confirm("Do you want to close this issue?");

    if (userResponse) {
      try {
        console.log(repoidstate, issueNumber)
        const tx = await stakingContract.closeIssueNoSolver(repoidstate, issueNumber)
        const receipt = await tx.wait(2)
        if (receipt.status === 1) {
          console.log("Transaction was successful!")

          const LStoken = localStorage.getItem("githubAccessToken")
          if (!LStoken) {
            console.log("GitHub access token not found.")
            return
          }
          console.log("token", LStoken)
          console.log("issueNo", issueNumber)

          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `token ${LStoken}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                state: "closed", // Close the issue
              }),
            },
          )

          if (response.ok) {
            // Filter out the closed issue from both states
            setIssues((prevIssues) =>
              prevIssues.filter((issue) => issue.number !== issueNumber),
            )
            setFilteredIssues((prevFilteredIssues) =>
              prevFilteredIssues.filter((issue) => issue.number !== issueNumber),
            )
            console.log(`Issue #${issueNumber} closed successfully.`)
            alert("Closed")
          } else {
            const errorData = await response.json()
            console.log(
              "Failed to close issue:",
              response.status,
              response.statusText,
              errorData,
            )
            alert(errorData.message)
          }
        } else {
          alert("Transaction failed!")
        }
      } catch (error) {
        console.log("Error closing issue:", error)
      }
    }
    else return
  }

  const getIssueInfo = async (repoId, issueId) => {
    try {
      if (token && account) {
        const [creator, prize, solved, solver, stakeCount, totalStakeAmt] =
          await stakingContract.getIssue(repoId, issueId)
        return [
          ethers.formatEther(prize, 18),
          stakeCount,
          ethers.formatEther(totalStakeAmt, 18),
          creator.toString(),
          solved,
        ]
      }
    } catch (e) {
      console.error("Error fetching prize:", e)
      return ["0", 0, 0] // Default to 0 if error occurs
    }
  }

  const getHighestPrize = () => {
    const prizes = Object.values(issueInfo).map(
      (info) => parseFloat(info.prize) || 0,
    )
    return Math.max(...prizes).toFixed(2) // Return the highest prize formatted to 2 decimals
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
          Highest Win Prize{" "}
          <div style={{ color: "var(--aqua)", fontSize: 20 }}>
            {getHighestPrize()} GST
          </div>
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
          <button className={styles.ForkButton} onClick={handleNewIssue}>New Issue</button>
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
            <div style={{ color: "var(--aqua)" }}>Creator</div>
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

                <div> {issueInfo[issue.number]?.prize || "0"} GST </div>
                <div>
                  {issueInfo[issue.number]?.creator
                    ? issueInfo[issue.number]?.creator.substring(0, 6) +
                    "..." +
                    issueInfo[issue.number]?.creator.substring(
                      issueInfo[issue.number]?.creator.length - 3,
                    )
                    : "Not Staked"}
                </div>
                <div>
                  {issue.assignee ? issue.assignee.login : "No assignee"}
                </div>
                <div>
                  {" "}
                  {issueInfo[issue.number]?.stakeCount?.toString() || "0"} (
                  {issueInfo[issue.number]?.totalStakeAmount || "0"} GST){" "}
                </div>
                <div>
                  <button
                    className={styles.ForkButton}
                    onClick={() =>
                      handleCloseIssue(
                        issue.number,
                        issueInfo[issue.number]?.solved || true,
                      )
                    }
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
