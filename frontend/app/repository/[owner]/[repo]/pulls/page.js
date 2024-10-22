"use client"
import Link from "next/link"
import styles from "../../../../styles.module.css"
import { useParams } from "next/navigation"
import { useEffect, useState, useContext } from "react"
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";

export default function PullReq() {
  const { provider, account, stakingContract, token, chainId } = useContext(Web3Context)

  const { owner, repo } = useParams()
  const [pullRequests, setPullRequests] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const token = localStorage.getItem("githubAccessToken")
        if (!token) {
          console.error("GitHub access token not found.")
          return
        }
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.log("Failed to fetch pull requests")
        }
        const data = await response.json()
        console.log(data)
        setPullRequests(data)
        console.log(pullRequests)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPullRequests()
  }, [owner, repo])

  if (loading) return <p>Loading pull requests...</p>
  if (error) return <p>Error: {error}</p>

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
          <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 GST</div>
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
          />
        </div>
        <div>
          <Link href={`/repository/${owner}/${repo}/pulls/new-pull`}>
            <button className={styles.ForkButton} style={{ width: 200 }}>
              New Pull Request
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.IssuesTable}>
        <div style={{ color: "var(--aqua)" }}>
          {pullRequests.length} open pull requests
        </div>
        <div style={{ color: "var(--aqua)" }}>Staked GST</div>
        <div style={{ color: "var(--aqua)" }}>Linked Issue</div>
        <div style={{ color: "var(--aqua)" }}>Solver</div>
        <div style={{ color: "var(--aqua)" }}>Reviews</div>
        <div style={{ color: "var(--aqua)" }}>Accepted/Rejected</div>

        <div
          style={{
            height: 0.1,
            gridColumnStart: 1,
            gridColumnEnd: 7,
            backgroundColor: "var(--divider)",
          }}
        ></div>

        {pullRequests ? pullRequests.map((pr) => (
          <>
            <div
              style={{
                paddingLeft: 20,
                display: "flex",
                margin: 0,
                flexDirection: "column",
                justifyContent: "left",
              }}
              key={pr.id}
            >
              <Link href={`/repository/${owner}/${repo}/pulls/${pr.number}`}>
                <span style={{ color: "var(--aqua)", fontSize: 20 }}>
                  #{pr.number}
                </span>
              </Link>{" "}
              <Link href={`/repository/${owner}/${repo}/pulls/${pr.number}`}>
                {pr.title}
              </Link>
              <span>Posted by {pr.user.login}</span>
            </div>
            <div>5</div> {/* Keep Win Prize as static */}
            <div>{pr.milestone ? pr.milestone.title : "None"}</div>
            <div>{pr.assignee ? pr.assignee.login : "Unassigned"}</div>
            <div>5</div> {/* Keep Stakes as static */}
            <div>{pr.review_comments}</div>
            <div
              style={{
                height: 0.1,
                gridColumnStart: 1,
                gridColumnEnd: 7,
                // backgroundColor: "var(--divider)",
              }}
            >

            </div>
          </>
        ))

          :

          <div>Limit Exceeded</div>}
      </div>
    </>
  )
}

// <table>
//     <thead>
//     19 open issues
//     </thead>
// </table>
