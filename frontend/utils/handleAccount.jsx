export const handleAccount = async (setInit) => {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    })
    const account = accounts[0]
    console.log("changed acc", account)
    setInit(prevState => ({ ...prevState, account }))
}