const { ethers, deployments } = require("hardhat")
const { GitHubStaking } = require("../scripts/index")

REPO_ID = 123
ISSUE_ID = 51
PRIZE = ethers.utils.parseEther("10");
AMT = ethers.utils.parseEther("0.1");

const initialAmount = ethers.utils.parseEther("1000");

async function requestTokens(staker) {
    const { _, tokenContract } = await GitHubStaking();
    await tokenContract.transfer(staker, initialAmount);
    return
}

async function createIssue() {
    const { GitHubStakingContract, _ } = await GitHubStaking();

    GitHubStakingContract.on("IssueCreated", (repoId, issueId, creator, prize) => {
        console.log(`Issue ${issueId.toString()} Created on Repo ${repoId.toString()}!`);
        console.log(`Staker: ${creator}`);
        console.log(`Prize: ${ethers.utils.formatEther(prize)} GST`);
    });

    const tx = await GitHubStakingContract.createIssue(REPO_ID, ISSUE_ID, PRIZE);
    await tx.wait(2);

    const { creator, prize, solved, solver, stakeCount, totalStakeAmt } = await GitHubStakingContract.getIssue(REPO_ID, ISSUE_ID)
    console.log("issue:", creator, ethers.utils.formatEther(prize), solved, solver, stakeCount, totalStakeAmt)
}

async function stake() {
    const { GitHubStakingContract, tokenContract } = await GitHubStaking();

    const [deployer, account1, account2] = await ethers.getSigners();

    // BALANCES
    const deployerbalance = await tokenContract.balanceOf(deployer.address);
    console.log(`deployerbalance: ${ethers.utils.formatEther(deployerbalance)} GST`);

    const stakerbalance = await tokenContract.balanceOf(account1.address);
    console.log(`Account1 Balance: ${ethers.utils.formatEther(stakerbalance)} GST`);

    const contractBalance = await tokenContract.balanceOf(GitHubStakingAddress);
    console.log(`GitHubStaking Contract Balance: ${ethers.utils.formatEther(contractBalance)} GST`);


    // ALAG SE BANANEKAY USER KE HISAB SE REQUEST KRNE TOKEN
    if (stakerbalance <= 10 && deployerbalance >= 1500) {
        requestTokens(account1.address)
        console.log("Transferred 1000 GST to ", account1.address)
    }

    // Approve the GitHubStaking contract to spend account1's tokens
    const allowance = await tokenContract.allowance(account1.address, GitHubStakingAddress);
    if (allowance.lt(AMT)) {
        await tokenContract.connect(account1).approve(GitHubStakingAddress, AMT);
        console.log(`Approved ${ethers.utils.formatEther(AMT)} GST for GitHubStaking contract.`);
    }

    // UPDATED BALANCES
    const deployerbalance2 = await tokenContract.balanceOf(deployer.address);
    console.log(`deployerbalance: ${ethers.utils.formatEther(deployerbalance2)} GST`);

    const stakerbalance2 = await tokenContract.balanceOf(account1.address);
    console.log(`Account1 Balance: ${ethers.utils.formatEther(stakerbalance2)} GST`);

    const contractBalance2 = await tokenContract.balanceOf(GitHubStakingAddress);
    console.log(`GitHubStaking Contract Balance: ${ethers.utils.formatEther(contractBalance2)} GST`);


    GitHubStakingContract.on("StakePlaced", (repoId, issueId, pullReqId, staker, amount) => {
        console.log(`Stake event detected!`);
        console.log(`Issue ID: ${issueId.toString()}`);
        console.log(`Staker: ${staker}`);
        console.log(`Amount: ${ethers.utils.formatEther(amount)} GST`);
    });

    const tx = await GitHubStakingContract.stakeOnIssue(REPO_ID, ISSUE_ID, PULL_REQ_ID, AMT)
    tx.wait(2)
    console.log("Staked!")

    const totalStakeAmount = await GitHubStakingContract.getTotalStakeAmount(REPO_ID, ISSUE_ID);
    console.log(`Total Stake Amount: ${ethers.utils.formatEther(totalStakeAmount)} GST`);

    const stakeCount = await GitHubStakingContract.getTotalStakers(REPO_ID, ISSUE_ID);
    console.log(`Total Stakers: ${stakeCount}`);

    for (i = 0; i < stakeCount; i++) {
        const stake = await GitHubStakingContract.getStake(REPO_ID, ISSUE_ID, i)
        console.log("stake: ", i, ": ", stake)
    }
}


createIssue()