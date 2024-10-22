const { ethers, deployments } = require("hardhat")

const spenderAddress = "0xd2983525E903Ef198d5dD0777712EB66680463bc"; // Replace with your contract's address
const spendAmt = ethers.utils.parseEther("10000000")

async function approveSpender() {
    const GitstakeTokenDeployment = await deployments.get("GitstakeToken");
    const tokenContract = await ethers.getContractAt(
        "GitstakeToken",
        GitstakeTokenDeployment.address
    );
    const tx = await tokenContract.approve(spenderAddress, spendAmt);
    await tx.wait();
    console.log("Approved", spenderAddress, "for spending", spendAmt.toString())
}

approveSpender()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })