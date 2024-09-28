// Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
const { ethers } = require("hardhat")

const networkConfig = {
  31337: {
    name: "hardhat",
  },
  5777: {
    name: "localhost",
  },
  11155111: {
    name: "sepolia",
  },
}
const INITIAL_SUPPLY = "1000000"

const devChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  devChains,
  INITIAL_SUPPLY,
}