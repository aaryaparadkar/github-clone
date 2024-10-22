import { Contract } from "ethers"
import { ethers } from "ethers"
import { tokenABI, stakingContractABI, tokenContractAdds, stakingContractAdds } from "../constants/index"

export const connectWallet = async () => {
    try {
        let [provider, account, stakingContract, token, chainId] = [null]
        if (window.ethereum == null) {
            throw new Error("no metamask.")
        }
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        let chainIdHex = await window.ethereum.request({
            method: "eth_chainId"
        })
        chainId = parseInt(chainIdHex, 16)

        account = accounts[0]
        if (!account) {
            console.log("no selectedacc")
        }

        provider = new ethers.BrowserProvider(window.ethereum)
        let signer = await provider.getSigner()

        let stakingContractAdd = chainId in stakingContractAdds ? stakingContractAdds[chainId][0] : null
        let tokenContractAdd = chainId in tokenContractAdds ? tokenContractAdds[chainId][0] : null

        stakingContract = new Contract(stakingContractAdd, stakingContractABI, signer)
        token = new Contract(tokenContractAdd, tokenABI, signer)

        let allowance = await token.allowance(account, stakingContract.target);
        console.log(`Current allowance: ${allowance.toString()}`);

        // const APPROVAL_AMT = ethers.parseEther("10000")
        // if (allowance < APPROVAL_AMT) {
        //     const tx = await token.approve(stakingContract, APPROVAL_AMT)
        //     await tx.wait()
        // }

        return {
            provider, account, stakingContract, token, chainId
        }
    }
    catch (error) {
        console.log("2:", error)
        throw new Error(error)
    }
}