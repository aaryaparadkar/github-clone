"use client"

import React, { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"

import CommentCard from "@/components/CommentCard"
import styles from "../../../../../styles.module.css"
import DescriptionCard from "@/components/descriptionCard"
// import PostSolution from "@/components/postComment"
import PullReqCard from "@/components/pullRequestCard"
import Image from "next/image"
import raise from "../../../../../assets/raise.png"
import remove from "../../../../../assets/remove.png"
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";

export default function Issue() {
  const { provider, account, stakingContract, token, chainId } = useContext(Web3Context)

  const { owner, repo, issue } = useParams()
  const [issueBody, setIssues] = useState(null)
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [issueInfo, setIssueInfo] = useState({})
  const [estDeduction, setEstDeduction] = useState(null);
  const [inputAmount, setInputAmount] = useState(''); // Store user input amount
  const [repoId, setRepoId] = useState(null)

  const [stakeholders, setStakeholders] = useState([]);


  let issueId = issue;
  // let repoId;

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access LStoken not found.")
          return
        }


        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        })
        let repoData
        if (repoResponse.ok) {
          repoData = await repoResponse.json()
          setRepoId(repoData?.id)
          console.log(repoData?.id)
        } else {
          console.error("Failed to fetch repo info:", repoResponse.statusText)
        }

        if (repoData?.id, issueId) {
          console.log(repoData?.id)
          const [winPrize, stakeCount, totalStakeAmount, highestAmt, highestStakeBy] = await getIssueInfo(repoData?.id, issue.number)
          setIssueInfo((prev) => ({
            ...prev,
            [issue.number]: { prize: winPrize, stakeCount, totalStakeAmount, highestAmt, highestStakeBy },
          }))
        }


        // Fetch authenticated user info
        const userResponse = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${LStoken}`,
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
              Authorization: `token ${LStoken}`,
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


  const fetchEstDeductionRate = async (repoId, issueId) => {
    try {
      console.log(repoId, issueId)
      const approxAmtWei = ethers.parseEther(inputAmount);

      if (stakingContract && stakingContract.getEstDeductionRateOnIssue) {
        const deductionRate = stakingContract.getEstDeductionRateOnIssue(repoId, issueId, approxAmtWei);
        setEstDeduction(ethers.formatEther(deductionRate)); // Convert from Wei to Ether for display
      } else {
        console.error("getEstDeductionRateOnIssue method not found on stakingContract");
      }

    } catch (error) {
      console.error("Error fetching estimated deduction:", error);
      setEstDeduction("N.A.");
    }
  }

  const getIssueInfo = async (repoId, issueId) => {
    try {
      if (token && account) {
        console.log("repoid", repoId)
        const [creator, prize, solved, solver, stakeCount, totalStakeAmt] = await stakingContract.getIssue(repoId, issueId)

        let highestStakeAmt = 0;
        let highestStakeBy;

        const fetchedStakeholders = [];

        for (let i = 1; i < stakeCount; i++) {
          const [index, pullReqId, staker, amt] = await stakingContract.getStake(repoId, issueId, i);
          const stakeAmount = ethers.formatUnits(amt, 18)

          fetchedStakeholders.push({ index, pullReqId, staker, stakeAmount });

          if (stakeAmount.gt(highestStakeAmt)) {
            highestStakeAmt = ethers.formatUnits(stakeAmount, 18);
            highestStakeBy = staker;
          }
        }

        setStakeholders(fetchedStakeholders);
        console.log(fetchedStakeholders)
        console.log(stakeholders)

        return [
          ethers.formatEther(prize),
          stakeCount,
          totalStakeAmt,
          ethers.formatEther(highestStakeAmt),
          highestStakeBy
        ]
      }
    } catch (e) {
      console.error("Error fetching prize:", e)
      return ["0", 0, 0] // Default to 0 if error occurs
    }
  }



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
              {issueInfo[issue.number]?.prize || "0"} GST
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
            - Highest Stake by {issueInfo[issue.number]?.highestStakeBy || "N.A."}
            {/* <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}>
              {issueBody?.user.login}
            </div> */}
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
              {issueInfo[issue.number]?.highestAmt || "0"} GST
            </div>
            - Opened on {new Date(issueBody.created_at).toLocaleDateString()} by
            <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}>
              {issueBody?.user.login}
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
            <input placeholder="Stake Amt" style={{ width: 150, height: 30, marginRight: 10 }} onChange={(e) => setInputAmount(e.target.value)}></input>
            <button style={{ marginRight: 10 }} onClick={() => fetchEstDeductionRate(repoId, issueId)} > Current Estimate Deduction on Issue is </button>
            {estDeduction || "N.A."}
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



            {/* fetchedStakeholders.push({ index, pullReqId, staker, stakeAmount }); */}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <PullReqCard stakeholders={stakeholders} />
            </div>





          </div>
        </>
      ) : (
        <div>Loading issue...</div>
      )}
    </>
  )
}
