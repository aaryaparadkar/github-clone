"use client";
import styles from "../../../../../styles.module.css";
import Image from "next/image";
import merge from "../../../../../assets/merge.png";
import tick from "../../../../../assets/tick.png";
import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";
import axios from 'axios';

export default function NewPullReq() {
  const { provider, account, stakingContract, token, chainId } = useContext(Web3Context);
  const { owner, repo } = useParams();

  const [forkedBranches, setForkedBranches] = useState([]);
  const [baseBranches, setBaseBranches] = useState([]);
  const [selectedBaseBranch, setSelectedBaseBranch] = useState("");
  const [selectedForkedBranch, setSelectedForkedBranch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [stakePrize, setStakePrize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [repoIDState, setRepoIDState] = useState(null);

  useEffect(() => {
    const fetchBaseBranches = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken");
        if (!LStoken) {
          throw new Error("Missing GitHub token");
        }

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/branches`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${LStoken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch branches: ${errorData.message}`);
        }

        const branches = await response.json();
        const branchNames = branches.map((branch) => branch.name);
        setBaseBranches(branchNames);
        setSelectedBaseBranch(branchNames[0]);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const fetchUserBranches = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken");
        if (!LStoken) {
          console.error("GitHub access token not found.");
          return;
        }

        const userResponse = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setAuthenticatedUser(userData.login);
          const response = await fetch(
            `https://api.github.com/repos/${userData.login}/${repo}/branches`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `token ${LStoken}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch branches: ${errorData.message}`);
          }

          const branches = await response.json();
          const forkBranchNames = branches.map((branch) => branch.name);
          setForkedBranches(forkBranchNames);
          setSelectedForkedBranch(forkBranchNames[0]);
        } else {
          console.error("Failed to fetch user info:", userResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const getRepoId = async () => {
      try {
        const LStoken = localStorage.getItem("githubAccessToken");
        if (!LStoken) {
          console.error("GitHub access token not found.");
          return;
        }
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        });
        if (repoResponse.ok) {
          const repoData = await repoResponse.json();
          const repoId = repoData?.id;
          setRepoIDState(repoId);
        } else {
          console.error("Failed to fetch repo info:", repoResponse.statusText);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchBaseBranches();
    fetchUserBranches();
    getRepoId();
  }, [owner, repo]);

  const handleCreatePullRequest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const LStoken = localStorage.getItem("githubAccessToken");
      if (!LStoken) {
        setError("Missing GitHub token");
        setLoading(false);
        return;
      }

      // Construct the final description including issue number linking
      const finalDescription = `${description}\n\nFixes #${issueNumber}`;

      // Request body for creating a PR
      const requestBody = {
        title,
        head: `${authenticatedUser}:${selectedForkedBranch}`, // Use selectedForkedBranch here
        base: selectedBaseBranch,
        body: finalDescription,
      };

      // Fetch the commit SHA from the latest commit on the selected forked branch
      const commitResponse = await fetch(
        `https://api.github.com/repos/${authenticatedUser}/${repo}/commits/${selectedForkedBranch}`,
        {
          headers: {
            Authorization: `token ${LStoken}`,
          },
        }
      );
      const commitData = await commitResponse.json();
      const commitSha = commitData.sha;

      // Perform the plagiarism check
      const plagiarismResponse = await axios.get(
        `https://muj-gitstakeai.onrender.com/api/plagiarism/${owner}/${repo}/${issueNumber}/${title}/${commitSha}`
      );
      const plagiarismScore = plagiarismResponse.data.score;

      if (plagiarismScore >= 0.8) {
        setError("Plagiarism score is too high. PR cannot be merged.");
        setLoading(false);
        return;
      }

      // Making a POST request to GitHub API for creating a pull request
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${LStoken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Failed to create pull request: ${errorData.message}`);
        setError(`Failed to create pull request: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log("Pull Request Created: ", data);

      const pullRequestId = data.id;
      console.log("Pull Request ID:", pullRequestId);

      const issueNumberWithoutHash = issueNumber.replace('#', ''); // Remove the '#' symbol
      const issueNumberInt = parseInt(issueNumberWithoutHash);

      const tx = await stakingContract.stakeOnIssue(repoIDState, issueNumberInt, pullRequestId, ethers.parseEther(stakePrize.toString()));
      const receipt = await tx.wait(2);

      if (receipt.status === 1) {
        console.log("Transaction successful and staked!");
        setSuccess(true);
      } else {
        setSuccess(false);
        console.error("Transaction failed!");
      }

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Branch selection for PR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Base branch dropdown */}
          <select
            className={styles.BranchOptions}
            onChange={(e) => setSelectedBaseBranch(e.target.value)}
            value={selectedBaseBranch}
          >
            {baseBranches?.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <Image
            style={{ transform: "rotate(90deg)" }}
            src={merge}
            width={30}
            height={30}
          />

          {/* Forked branch dropdown */}
          <select
            className={styles.BranchOptions}
            onChange={(e) => setSelectedForkedBranch(e.target.value)}
            value={selectedForkedBranch}
          >
            {forkedBranches?.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <div
            style={{
              color: "#40bf63",
              display: "flex",
              justifyContent: "center",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image src={tick} width={30} height={30} />
            Able to Merge
          </div>
        </div>

        {/* ETH stake prize input */}
        <div>
          Set Stake Prize (minimum 0.1 GST) <br />
          <input
            type="number"
            placeholder="ETH Prize"
            value={stakePrize}
            onChange={(e) => setStakePrize(e.target.value)}
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

        {/* PR title input */}
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

        {/* Issue number input */}
        <div>
          Fix Issue Number <br />
          <input
            placeholder="#<Number>"
            value={issueNumber}
            onChange={(e) => setIssueNumber(e.target.value)}
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

        {/* PR description input */}
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

        {/* Create Pull Request Button */}
        <div>
          <button
            className={styles.ForkButton}
            style={{ width: 200 }}
            onClick={handleCreatePullRequest}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Pull Request"}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {success && (
          <div style={{ color: "green" }}>
            Pull Request Created Successfully!
          </div>
        )}
      </div>
    </>
  );
}
