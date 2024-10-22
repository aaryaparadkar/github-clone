const { ethers, deployments } = require("hardhat");


const initialAmount = ethers.utils.parseEther("1000");

async function requestTokens(staker) {
    const TokenAddress = (await deployments.get("GitstakeToken")).address
    const token = await ethers.getContractAt(
        "GitstakeToken",
        TokenAddress
    );

    await token.transfer(staker, initialAmount);
    console.log(`Transferred ${staker} ${initialAmount}.`)

    const allowance = await token.allowance(staker, GitHubStakingAddress);
    console.log("Allowed to spend ", allowance, "AMT.")
    if (allowance.lt(10)) {
        await token.connect(account1).approve(GitHubStakingAddress, initialAmount);
        console.log(`Approved ${ethers.utils.formatEther(initialAmount)} GST for GitHubStaking contract.`);
    }

    return
}


module.exports = { requestTokens };