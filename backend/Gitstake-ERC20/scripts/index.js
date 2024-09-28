const { ethers, deployments } = require("hardhat")

async function GitHubStaking() {
    const GitHubStakingDeployment = await deployments.get("GitHubStaking");
    const accounts = await ethers.getSigners()
    let signer = accounts[0]

    const GitHubStakingContract = await ethers.getContractAt(
        "GitHubStaking",
        GitHubStakingDeployment.address,
        signer
    );

    const TokenAddress = (await deployments.get("GitstakeToken")).address

    const tokenContract = await ethers.getContractAt(
        "GitstakeToken",
        TokenAddress,
        signer
    );

    return { GitHubStakingContract, tokenContract };
}

module.exports = { GitHubStaking }