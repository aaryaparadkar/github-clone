// import { Inter } from "next/font/google";
"use client"
import "./globals.css";
import styles from "./styles.module.css";
import Header from "../components/header.js";

import { useEffect, useState } from "react";
import { connectWallet } from "@/utils/connectWallet";
import Web3Context from "@/context/Web3Context";
import { handleAccount } from "@/utils/handleAccount";
import { handleChain } from "@/utils/handleChain";

// export const metadata = {
//   title: "GitStake",
//   description: "Decentralized Staking Platform",
// };

export default function RootLayout({ children }) {

  useEffect(() => {
    window.ethereum.on("accountsChanged", () => handleAccount(setInit))
    window.ethereum.on("chainChanged", () => handleChain(setInit))
    return () => {
      window.ethereum.removeListener("accountsChanged", () => handleAccount(setInit))
      window.ethereum.removeListener("chainChanged", () => handleChain(setInit))
    }
  }, [])

  const [init, setInit] = useState({
    provider: null,
    account: 0x00,
    stakingContract: null,
    token: null,
    chainId: null
  })

  const [isLoading, setIsLoading] = useState()
  const handleWallet = async () => {
    try {
      setIsLoading(true)
      const { provider, account, stakingContract, token, chainId } = await connectWallet();
      console.log(provider, account, stakingContract, token, chainId)
      setInit({ provider, account, stakingContract, token, chainId })
    }
    catch (err) {
      console.error("1: ", err)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <html lang="en">
      {/* <head>
        <link rel="shortcut icon" href="../assets/logo3.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="../assets/logo3.pngg" />
        <link rel="icon" type="image/png" sizes="32x32" href="../assets/logo3.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="../assets/logo3.png" />
      </head> */}
      <body>
        <div className={styles.backgroundDiv}>
          <Header connectFunction={handleWallet} account={init.account} />
          <Web3Context.Provider value={init}>
            {
              (isLoading) ? <p>Loading...</p> : children
            }

          </Web3Context.Provider>
        </div>
      </body>
    </html>
  );
}
