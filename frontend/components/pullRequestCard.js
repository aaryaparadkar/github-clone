"use client"

import React, { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"

import profile from "../app/assets/profile1.jpg"
import raise from "../app/assets/raise.png"
import remove from "../app/assets/remove.png"
import Image from "next/image"
import styles from "../app/styles.module.css"
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";

export default function PullReqCard({ stakeholders }) {
  console.log(stakeholders)

  const { provider, account, stakingContract, token, chainId } = useContext(Web3Context)
  const { owner, repo, issue, pull } = useParams()
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [linkedPrs, setLinkedPrs] = useState([]) // Array to store multiple PRs
  const [repoId, setRepoId] = useState()
  const [issueId, setIssueId] = useState(issue)
  const [stakesData, setStakesData] = useState({})

  const handleMerge = (pullReqId) => {
    if (repoId && issueId && pullReqId) {
      try {
        // markSolved
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  /*const fetchStakeAddress = async (pullReqId) => {
    if (repoId && issueId && pullReqId) {
      try {
        const stakeData = await stakingContract.getStake(repoId, issueId, pullReqId);
        const stakerAddress = stakeData[0]; // staker's address
        return stakerAddress;
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  const fetchStakeAmt = async (pullReqId) => {
    if (repoId && issueId && pullReqId) {
      try {
        const stakeData = await stakingContract.getStake(repoId, issueId, pullReqId);
        const stakedAmount = stakeData[1]; // staked amount
        return stakedAmount;
      }
      catch (e) {
        console.log(e)
      }
    }
  }*/



  useEffect(() => {
    const fetchUser = async () => {

      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access token not found.")
          return
        }

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
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    const fetchLinkedPRs = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access token not found.")
          return
        }
        if (issue) {
          const response = await fetch(
            `https://api.github.com/search/issues?q=is:pr+${issue}+repo:${owner}/${repo}`,
            {
              headers: {
                Authorization: `token ${LStoken}`,
                Accept: "application/vnd.github.v3+json",
              },
            },
          )
          const data = await response.json()
          if (Array.isArray(data.items) && data.items.length > 0) {
            const prsData = await Promise.all(
              data?.items.map(async (item) => {
                const linkedResponse = await fetch(item.pull_request.url, {
                  headers: {
                    Authorization: `token ${LStoken}`,
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
                Authorization: `token ${LStoken}`,
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
                    Authorization: `token ${LStoken}`,
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


    const fetchRepo = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          console.error("GitHub access token not found.")
          return
        }
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        })
        if (repoResponse.ok) {
          const repoData = await repoResponse.json()
          const repoID = repoData?.id
          setRepoId(repoData?.id)
          console.log(repoID)
        } else {
          console.error("Failed to fetch repo info:", repoResponse.statusText)
        }

      } catch (error) {
        console.log("Error", error)
      }
    }

    if (account == 0 || !account || !token) {
      alert("Connect Wallet.")
    }
    else {
      fetchUser()
      fetchLinkedPRs()
      fetchRepo()
    }

  }, [issue, pull, repo, owner, account, token])


  // useEffect(() => {
  //   const fetchStakeDataForPRs = async () => {
  //     if (repoId && issueId && linkedPrs.length > 0) {
  //       try {
  //         const stakes = await Promise.all(
  //           linkedPrs.map(async (pr) => {
  //             console.log(repoId, issueId, pr.id)

  //             let stakeData;

  //             if (stakeholders) {
  //               stakeData = stakeholders.find(stake => stake.pullReqId === pr.id) || { index: "", pullReqId: pr.id , staker: "N.A.", stakeAmount: "0" };
  //             }
  //             console.log(stakeData)

  //             return {
  //               prId: pr.id,
  //               stakerAddress: stakeData[0],
  //               stakedAmount: ethers.formatEther(stakeData[1].toString()),
  //             }
  //           }),
  //         )

  //         // Convert the stakes array to an object with PR IDs as keys
  //         const stakeObject = stakes.reduce((acc, stake) => {
  //           acc[stake.prId] = stake
  //           return acc
  //         }, {})

  //         setStakesData(stakeObject)
  //       } catch (error) {
  //         console.log("Error fetching stake data:", error)
  //       }
  //     }
  //   }

  //   fetchStakeDataForPRs()
  // }, [repoId, issueId, linkedPrs])

  const dataToDisplay = null
  //   Array.isArray(linkedPrs) && linkedPrs.length > 0 ? linkedPrs : []

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
                {data.user ? data.user.login : ""} ({stakesData[data.id]?.stakerAddress || "Loading..."})
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
                  {stakesData[data.id]?.stakedAmount || "0"}  GST
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
                  <div style={{ color: "var(--aqua)" }}> Closed </div>
                ) : (
                  <button className={styles.ForkButton} onClick={() => handleMerge(data?.id, stakesData[data.id]?.stakerAddress)}>Merge</button>
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
