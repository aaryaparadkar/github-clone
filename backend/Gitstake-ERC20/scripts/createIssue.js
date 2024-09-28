const { ethers, deployments } = require("hardhat")

REPO_ID = 123
ISSUE_ID = 51
PRIZE = ethers.utils.parseEther("10");

async function createIssue() {
    const GitHubStakingDeployment = await deployments.get("GitHubStaking");

    const GitHubStakingContract = await ethers.getContractAt(
        "GitHubStaking",
        GitHubStakingDeployment.address
    );

    GitHubStakingContract.on("IssueCreated", (repoId, issueId, creator, prize) => {
        console.log(`Issue ${issueId.toString()} Created on Repo ${repoId.toString()}!`);
        console.log(`Staker: ${creator}`);
        console.log(`Prize: ${ethers.utils.formatEther(prize)} GST`);
    });

    // Stake on the issue
    const tx = await GitHubStakingContract.createIssue(REPO_ID, ISSUE_ID, PRIZE);
    await tx.wait(2);


    const { creator, prize, solved, solver, stakeCount, totalStakeAmt } = await GitHubStakingContract.getIssue(REPO_ID, ISSUE_ID)
    console.log("issue:", creator, ethers.utils.formatEther(prize), solved, solver, stakeCount, totalStakeAmt)

}

createIssue()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })