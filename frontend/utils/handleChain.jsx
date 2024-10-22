export const handleChain = async (setInit) => {
    let chainIdHex = await window.ethereum.request({
        method: "eth_chainId"
    })
    let chainId = parseInt(chainIdHex, 16)
    console.log("changed chainid", chainId)
    setInit(prevState => ({ ...prevState, chainId }))
}