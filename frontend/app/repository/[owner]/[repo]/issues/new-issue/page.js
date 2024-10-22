"use client"
import { useParams, useRouter } from "next/navigation"
import { useContext, useState } from "react"
import styles from "../../../../../styles.module.css"
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";

export default function NewIssue() {
  const { provider, account, stakingContract, token, chainId } = useContext(Web3Context)

  const router = useRouter()
  const { owner, repo } = useParams()

  const [issueId, setIssueId] = useState()
  //const [repoId, setRepoId] = useState()
  let repoId;

  const [ethPrize, setEthPrize] = useState(0.1) // Default value 0.1 ETH
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [data, setData] = useState({})



  const handleCreateIssue = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.")
      return
    }

    if ((ethers.parseEther(ethPrize.toString())) < (ethers.parseEther("0.1"))) {
      setError("Prize set to less than minimum amount.")
      return
    }
    setLoading(true)
    setError(null)

    try {
      // stakingContract.on("IssueCreated", (repoId, issueId, creator, prize) => {
      //   console.log(`Issue ${issueId.toString()} Created on Repo ${repoId.toString()}!`);
      //   console.log(`Staker: ${creator}`);
      //   console.log(`Prize: ${ethers.formatEther(prize)} GST`);
      // });

      if (token && account && account != 0) {
        const LStoken = localStorage.getItem("githubAccessToken")
        if (!LStoken) {
          setError("GitHub access token not found.")
          setLoading(false)
          return
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
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        })
        if (repoResponse.ok) {
          const repoData = await repoResponse.json()
          repoId = repoData?.id
          console.log("Repo id is", repoId)
        } else {
          console.error("Failed to fetch repo info:", repoResponse.statusText)
          return
        }

        console.log(repo, owner, LStoken)

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${LStoken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              body: description, // Only the description is included in the body
              // labels: tags.split(",").map((tag) => tag.trim()), // Split tags into array and add as labels
            }),
          },
        )
        console.log(response)
        if (response.ok) {
          const data = await response.json()
          console.log("Data is", data)
          console.log("Issue created:", data?.number)
          setIssueId(data?.number)

          console.log("Issue creating from contract...")
          console.log(repoId, data?.number, ethers.parseEther(ethPrize.toString()))

          let currentAllowance = await token.allowance(account, account);
          console.log("Current Allowance:", currentAllowance.toString());

          const tx = await stakingContract.createIssue(repoId, data?.number, ethPrize.toString());
          const contractresponse = await tx.wait(2);
          if (contractresponse.status == 1) {
            console.log("Created Contract Issue")
            router.push(`/repository/${owner}/${repo}/issues`)
          }


        }
        else {
          setError("Failed to create issue.")
          console.log("Failed to create issue:", response.statusText)
          return
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error creating issue:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          padding: "30px 20%",
          gap: 30,
        }}
      >
        <div>
          Set Win Prize (minimum 0.1 GST) <br />
          <input
            type="number"
            placeholder="ETH Prize"
            value={ethPrize}
            onChange={(e) => setEthPrize(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>
        <div>
          Add Title
          <br />
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          Add Tags (comma separated)
          <br />
          <input
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          Add Description
          <br />
          <textarea
            placeholder="Add your description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              minHeight: 150,
              color: "var(--font)",
              padding: "5px",
              width: "750px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button
            className={styles.ForkButton}
            onClick={handleCreateIssue}
            disabled={loading}
            style={{ width: 200 }}
          >
            {loading ? "Creating..." : "Create New Issue"}
          </button>
        </div>
      </div>
    </>
  )
}