"use client"
import { useContext, useEffect, useState } from "react";
import styles from "../app/styles.module.css";
import Web3Context from "@/context/Web3Context";
import { ethers } from "ethers";

export default function MyStatsCard() {

    //const INITIAL_AMT = ethers.parseEther("100");
    const [ethAmt, setEthAmt] = useState(0);
    const [estGST, setEstGST] = useState(0);
    const CONTRACT_FUNDS = ethers.parseEther("500");
    // Convert 100 tokens to BigNumber, assuming the token has 18 decimal places
    const INITIAL_AMT = ethers.parseUnits("100", 18);

    const { provider, account, stakingContract, token, chainId } = useContext(Web3Context)

    const [isOwner, setisowner] = useState(false)

    const [txStatus, setTxStatus] = useState()
    const [requestStatus, setReqStatus] = useState()
    const [soldTokens, setsoldTokens] = useState(0)

    const [user, setUser] = useState("N.A.")
    const [allowance, setAllowance] = useState(0)
    const [balance, setBalance] = useState(0)
    const [contractBalance, setContractBalance] = useState(0)
    const [lostStakeCount, setlostStakeCount] = useState(0)
    const [wonStakeCount, setwonStakeCount] = useState(0)

    const [totalPriceAmt_SetByMe, settotalPriceAmt_SetByMe] = useState(0)
    const [openPriceAmt_SetByMe, setopenPriceAmt_SetByMe] = useState(0)
    const [totalIssues_SetByMe, settotalIssues_SetByMe] = useState(0)
    const [openIssues_SetByMe, setopenIssues_SetByMe] = useState(0)
    const [rewardsEarned, setrewardsEarned] = useState(0)
    const [withdrawAmt, setWithdrawAmt] = useState(0)
    const [lost_refund, setlost_refund] = useState(0)

    const [totalAmtStaked, settotalAmtStaked] = useState(0)
    const [openAmtStaked, setopenAmtStaked] = useState(0)
    const [totalStakes, settotalStakes] = useState(0)
    const [openStakes, setopenStakes] = useState(0)

    const handleChange = async (e) => {
        setEthAmt(e.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchData() {
                console.log(1)
                if (ethers.parseEther(ethAmt) <= ethers.parseEther("10")) {
                    try {
                        const estGSTfromcontract = await stakingContract.getGSTValueForETHValue(ethers.parseEther(ethAmt));
                        console.log(estGSTfromcontract.toString());
                        setEstGST(parseInt(estGSTfromcontract));
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    setEstGST(0);
                }
            }

            if (ethAmt && ethAmt > 0) {
                fetchData();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [ethAmt]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token && account) {
                    const ownerAddress = await token.getTokenOwner()
                    if (account.toLowerCase() == ownerAddress.toLowerCase()) {
                        setisowner(true)
                        const cb = await token.balanceOf(stakingContract.target)
                        setContractBalance(ethers.formatUnits(cb, 18))
                    }
                    else {
                        setisowner(false)
                        setContractBalance(0)
                    }

                    const getBalance = await token.balanceOf(account)
                    setBalance(ethers.formatUnits(getBalance, 18))

                    const soldgst = await stakingContract.getSoldTokens()
                    setsoldTokens(ethers.formatUnits(soldgst, 18))

                    const getAllowance = await token.allowance(account, stakingContract.target)
                    setAllowance(ethers.formatUnits(getAllowance, 18))

                    const { user, lost, won } = await stakingContract.getBasicWalletDetails(account)
                    setUser(user)
                    setlostStakeCount((lost) ? parseInt(lost) : 0)
                    setwonStakeCount((lost) ? parseInt(won) : 0)

                    const { totalPriceAmt_SetByMe, openPriceAmt_SetByMe, totalIssues_SetByMe, openIssues_SetByMe } = await stakingContract.getIssueStats(account)
                    settotalPriceAmt_SetByMe(ethers.formatUnits(totalPriceAmt_SetByMe, 18))
                    setopenPriceAmt_SetByMe(ethers.formatUnits(openPriceAmt_SetByMe, 18))
                    settotalIssues_SetByMe((totalIssues_SetByMe) ? parseInt(totalIssues_SetByMe) : 0)
                    setopenIssues_SetByMe((openIssues_SetByMe) ? parseInt(openIssues_SetByMe) : 0)

                    const { rewardsEarned, withdrawAmt, lost_refund } = await stakingContract.getRewardsWalletDetails(account)
                    setrewardsEarned(ethers.formatUnits(rewardsEarned, 18))
                    setWithdrawAmt(ethers.formatUnits(withdrawAmt, 18))
                    setlost_refund(ethers.formatUnits(lost_refund, 18))

                    const { totalAmtStaked, openAmtStaked, totalStakes, openStakes } = await stakingContract.getStakingWalletDetails(account)
                    settotalAmtStaked(ethers.formatUnits(totalAmtStaked, 18))
                    setopenAmtStaked(ethers.formatUnits(openAmtStaked, 18))
                    settotalStakes((totalStakes) ? parseInt(totalStakes) : 0)
                    setopenStakes((openStakes) ? parseInt(openStakes) : 0)

                }
            }
            catch (error) {
                console.log("mystats:", error)
            }
        }
        fetchData()
    }, [stakingContract, account, txStatus, requestStatus])

    const approveTokens = async () => {
        try {
            // const tx = await token.increaseAllowance(stakingContract.target, INITIAL_AMT)
            // setTxStatus("Approving...")
            if (token) {
                let currentAllowance = await token.allowance(account, stakingContract.target);
                console.log("Current Allowance:", currentAllowance.toString());

                let newAllowance = currentAllowance.add(INITIAL_AMT); // Increase by 100 tokens
                const tx = await token.approve(stakingContract.target, newAllowance);
                await tx.wait();

                // if (isOwner) {

                //     let OwnercurrentAllowance = await token.allowance(account, account);

                //     console.log(OwnercurrentAllowance);
                //     console.log("Initial Amount:", INITIAL_AMT.toString());
                //     if (parseInt(OwnercurrentAllowance) <= 0) {
                //         const tx = await token.approveOwnerOfSupply(ethers.parseEther("1000000"))
                //         await tx.wait();
                //     }
                // }


                const reciept = await tx.wait()
                if (reciept.status == 1) {
                    setTxStatus("Approved.")
                    setTimeout(() => {
                        setTxStatus(null)
                    }, 5000)
                }
                else {
                    setTxStatus("Failed.")
                }
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    async function fundContract() {
        try {
            console.log(`Funding contract ${stakingContract.target} from GST ${token.target}.`)
            const tx = await token.fundContract(stakingContract.target, CONTRACT_FUNDS)
            const response = await tx.wait(1)
            if (response.status == 0) {
                alert("Error occured !")
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    async function requestTokens() {
        try {
            if (ethAmt <= 0) {
                alert("Enter POL Amount.")
                return
            }
            if (ethers.parseEther(ethAmt) <= 5) {
                alert("Valid POL Amount is less than 5 POL.")
                return
            }
            setReqStatus("Requesting...")
            console.log(`total supply: ${await token.totalSupply()}`)
            console.log(`contract balance: ${await token.balanceOf(stakingContract)}`)

            const ethAmtInWei = ethers.parseUnits(ethAmt.toString(), "ether");

            const receipt = await stakingContract.requestTokens(ethAmtInWei);

            if (receipt.success == 1) {
                console.log(`Transferred GST for ${ethers.formatUnits(ethAmtInWei, 18)} ETH/POL to ${account}.`);
                setReqStatus("Transferred.")
            }
            else {
                setReqStatus("Failed.")

            }
            setTimeout(() => {
                setReqStatus(null);
            }, 5000);
        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}>Account Details</div>
            <div className={styles.MyStatsContainer}>
                <div>
                    Total Sold GST <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        {soldTokens.toString().length > 8 ? `${soldTokens.toString().slice(0, 8)}...` : soldTokens.toString()} GST</div>
                </div>
                <div>
                    GitHub Username <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        {user || " N.A."}</div>
                </div>
                {
                    !isOwner ?
                        <><div>
                            Withdraw Proceedings <div style={{ color: "var(--aqua)", fontSize: 20 }}>{withdrawAmt} GST </div>
                        </div>
                            <div>
                                <button className={styles.WithdrawButton}>Withdraw</button>
                            </div></>
                        :
                        <><div>
                            Contract Balance <div style={{ color: "var(--aqua)", fontSize: 20 }}>{contractBalance} GST</div>
                        </div>
                            <div>
                                <button className={styles.WithdrawButton} onClick={fundContract}>Fund Contract</button>
                            </div>
                        </>
                }

                <div>
                    Enter POL Amt
                    <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        <input onChange={handleChange} value={ethAmt} style={{ width: 120 }} />
                    </div>
                </div>

                <div>
                    GST Amt for POL
                    <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        {estGST} GST
                    </div>
                </div>

                <div>
                    Wallet Balance
                    <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        {balance.toString().length > 8 ? `${balance.toString().slice(0, 8)}...` : balance.toString()} GST
                    </div>
                </div>

                <div>
                    <button className={styles.WithdrawButton} onClick={requestTokens}>
                        {requestStatus ? requestStatus : `Request GST`}
                    </button>
                </div>

                <div>
                    Allowance <div style={{ color: "var(--aqua)", fontSize: 20 }}>
                        {allowance.toString()} GST</div>
                </div>
                <div>
                    <button className={styles.WithdrawButton} onClick={approveTokens}>
                        {txStatus ? txStatus : "Approve 1000 GST"}
                    </button>
                </div>

                <div style={{ maxHeight: 0.1, gridColumnStart: 1, gridColumnEnd: 3, backgroundColor: "var(--divider)" }}></div>

                <div>
                    Deduction Rate <div style={{ color: "var(--aqua)", fontSize: 20 }}> 0.1</div>
                </div>

                <div>Open/Total Stakes <div style={{ color: "var(--aqua)", fontSize: 20 }}> {openStakes}/{totalStakes} </div> </div>
                <div>Won Stakes<div style={{ color: "var(--aqua)", fontSize: 20 }}> {wonStakeCount} </div></div>
                <div>Lost Stakes <div style={{ color: "var(--aqua)", fontSize: 20 }}> {lostStakeCount} </div> </div>
                <div>Total GST Staked <div style={{ color: "var(--aqua)", fontSize: 20 }}> {totalAmtStaked} GST </div> </div>
                <div>Open(Pending)GST Staked <div style={{ color: "var(--aqua)", fontSize: 20 }}> {openAmtStaked} GST</div> </div>
                <div>Rewards Earned <div style={{ color: "var(--aqua)", fontSize: 20 }}> {rewardsEarned} GST</div> </div>
                <div>Lost Refund<div style={{ color: "var(--aqua)", fontSize: 20 }}> {lost_refund} GST</div> </div>


                <div style={{ maxHeight: 0.1, gridColumnStart: 1, gridColumnEnd: 3, backgroundColor: "var(--divider)" }}></div>
                <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}> Stakes Set By Me</div>

                <div>Total Prize Amount Set<div style={{ color: "var(--aqua)", fontSize: 20 }}> {totalPriceAmt_SetByMe} GST</div> </div>
                <div>Open Prize Amount<div style={{ color: "var(--aqua)", fontSize: 20 }}> {openPriceAmt_SetByMe} GST</div> </div>
                <div>Total Issues Set<div style={{ color: "var(--aqua)", fontSize: 20 }}> {totalIssues_SetByMe}</div> </div>
                <div>Open Issues<div style={{ color: "var(--aqua)", fontSize: 20 }}> {openIssues_SetByMe} </div> </div>

                {/* <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>Analysis</div> */}

            </div>
        </>
    )
}


