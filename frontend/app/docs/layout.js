"use client"
import styles from "../styles.module.css"

export default function Docs({ children }) {
    return (
        <>
            <main className={styles.DashboardMain_docs}>
                <div>
                    <div>Blockchain Roadmap</div>
                    <div>What is GitStake and DeFi principles?</div>
                    <div>What is GitStakeToken (GST) ?</div>
                    <div>Requesting Tokens (ICO)</div>
                    <div>Raising Issue on a Repository and Setting Bounties</div>
                    <div>Proof-of-Stake in GitStake</div>
                    <div>Incentivization for Solver and Calculating Deduction Rate</div>
                    <div>Account Details Stats Information</div>
                </div>

                {children}

            </main>
        </>
    )
}