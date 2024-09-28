const { network } = require("hardhat")
const {
    devChains,
    INITIAL_SUPPLY,
} = require("../helper-hardhat.config.js")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const gst = await deploy("GitstakeToken", {
        from: deployer,
        args: [INITIAL_SUPPLY],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`GitstakeToken deployed at ${gst.address}`) // 0x1c32f8818e38a50d37d1E98c72B9516a50985227

    if (
        !devChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(gst.address, [INITIAL_SUPPLY])
    }
}

module.exports.tags = ["all", "token"]

// 300485634750532068
// 529439727394145688
// 437536196796658391

// 76874569432094626
// 1105899578622097584