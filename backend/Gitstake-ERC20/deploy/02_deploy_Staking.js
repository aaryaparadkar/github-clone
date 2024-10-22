const { network, ethers } = require("hardhat")
const { networkConfig, devChains } = require("../helper-hardhat.config.js")
const { verify } = require("../utils/verify.js")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts();

    let GitstakeTokenAddress;

    console.log("Deploying token with the account:", deployer, "on", network.name);

    if (devChains.includes(network.name)) {
        const token = await deployments.get("GitstakeToken");
        GitstakeTokenAddress = token.address
        console.log(GitstakeTokenAddress)
    }
    else {
        GitstakeTokenAddress = "0x72ebf177e18f3CBa29a82aE50c3Ee24b12dfeAB3"
    }

    const args = [GitstakeTokenAddress]

    const GitHubStakingContract = await deploy("GitHubStaking", { // 0x71d2EBF08bF4FcB82dB5ddE46677263F4c534ef3
        from: deployer,
        args: args, // contract constructor parameters
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // verify
    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(GitHubStakingContract.address, args)
    }
}

module.exports.tags = ["all", "staking"]


// token = 0x72ebf177e18f3CBa29a82aE50c3Ee24b12dfeAB3
// staking = 0xcD8586fF024062da8F78e126a93920f349cc2aE5, 0x7c8ec71eC47e47d43732763A987973778d09C406