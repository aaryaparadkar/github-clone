const { ethers, network, deployments } = require("hardhat");
const fs = require("fs");

const FRONTEND_PATH_TOKEN_ABI = "../../frontend/constants/tokenContractABI.json";
const FRONTEND_PATH_CONTRACT_ABI = "../../frontend/constants/stakingContractABI.json";

const FRONTEND_PATH_TOKEN_ADD = "../../frontend/constants/tokenContractAddress.json";
const FRONTEND_PATH_CONTRACT_ADD = "../../frontend/constants/stakingContractAddress.json";

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    console.log("Updating Frontend...");

    await updateContractAddresses(deployer);
    await updateAbi();

    console.log("Frontend update completed.");
};

async function updateAbi() {
    try {
        console.log("Updating ABI...");

        const tokenDeployment = await deployments.get("GitstakeToken");
        const stakingDeployment = await deployments.get("GitHubStaking");

        const token = await ethers.getContractAt("GitstakeToken", tokenDeployment.address);
        const contract = await ethers.getContractAt("GitHubStaking", stakingDeployment.address);

        fs.writeFileSync(FRONTEND_PATH_TOKEN_ABI, JSON.stringify(token.interface.format("json"), null, 2));
        fs.writeFileSync(FRONTEND_PATH_CONTRACT_ABI, JSON.stringify(contract.interface.format("json"), null, 2));

        console.log("ABI updated successfully.");
    } catch (error) {
        console.error("Error updating ABI:", error);
    }
}

async function updateContractAddresses(deployer) {
    try {
        console.log("Updating Addresses...");

        const tokenDeployment = await deployments.get("GitstakeToken");
        const stakingDeployment = await deployments.get("GitHubStaking");

        const tokenAddress = tokenDeployment.address;
        const stakingAddress = stakingDeployment.address;

        const chainId = network.config.chainId.toString();
        const currentAddressesToken = JSON.parse(fs.readFileSync(FRONTEND_PATH_TOKEN_ADD, "utf-8"));
        const currentAddressesContract = JSON.parse(fs.readFileSync(FRONTEND_PATH_CONTRACT_ADD, "utf-8"));

        console.log(`Token address: ${tokenAddress}`);
        console.log(`Staking contract address: ${stakingAddress}`);
        console.log(`Chain ID: ${chainId}`);

        if (chainId in currentAddressesToken) {
            if (!currentAddressesToken[chainId].includes(tokenAddress)) {
                currentAddressesToken[chainId].unshift(tokenAddress);
            }
        } else {
            currentAddressesToken[chainId] = [tokenAddress];
        }

        if (chainId in currentAddressesContract) {
            if (!currentAddressesContract[chainId].includes(stakingAddress)) {
                currentAddressesContract[chainId].unshift(stakingAddress);
            }
        } else {
            currentAddressesContract[chainId] = [stakingAddress];
        }

        fs.writeFileSync(FRONTEND_PATH_TOKEN_ADD, JSON.stringify(currentAddressesToken, null, 2));
        fs.writeFileSync(FRONTEND_PATH_CONTRACT_ADD, JSON.stringify(currentAddressesContract, null, 2));

        console.log("Addresses updated successfully.");
    } catch (error) {
        console.error("Error updating contract addresses:", error);
    }
}

module.exports.tags = ["all", "update-frontend"];
0.431973019191654868
1.310418503046819045