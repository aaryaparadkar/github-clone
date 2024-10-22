const { ethers } = require("hardhat");

REPO_ID = 123
ISSUE_ID = 51
PULL_REQ_ID = 22

async function markSolved() {
    const [deployer, account1] = await ethers.getSigners();

    const GitHubStakingAddress = (await deployments.get("GitHubStaking")).address
    const TokenAddress = (await deployments.get("GitstakeToken")).address

    const tokenContract = await ethers.getContractAt(
        "GitstakeToken",
        TokenAddress
    );

    const GitHubStakingContract = await ethers.getContractAt(
        "GitHubStaking",
        GitHubStakingAddress,
        deployer
    );

    const tx = await GitHubStakingContract.markSolved(REPO_ID, ISSUE_ID, PULL_REQ_ID, account1.address)
    tx.wait(2)
    console.log("Solved!")

    GitHubStakingContract.on("IssueSolved", (repoId, issueId, pullReqId, creator, solver, prize) => {
        console.log(`Issue Solved!`);
        console.log(`pullReqId: ${pullReqId.toString()}`);
        console.log(`solver: ${solver}`);
        console.log(`prize: ${ethers.utils.formatEther(prize)} GST`);
    });



    // BALANCES
    const deployerbalance = await tokenContract.balanceOf(deployer.address);
    console.log(`deployerbalance: ${ethers.utils.formatEther(deployerbalance)} GST`);

    const stakerbalance = await tokenContract.balanceOf(account1.address);
    console.log(`Account1 Balance: ${ethers.utils.formatEther(stakerbalance)} GST`);

    const contractBalance = await tokenContract.balanceOf(GitHubStakingAddress);
    console.log(`GitHubStaking Contract Balance: ${ethers.utils.formatEther(contractBalance)} GST`);

    // EARNINGS
    const account1Earn = await GitHubStakingContract.getTotalEarnings(account1)
    console.log("eans: ", account1Earn)
}

markSolved()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })