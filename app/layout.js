// import { Inter } from "next/font/google";
"use client"
import "./globals.css"
import styles from "./styles.module.css"
import logo from "../app/assets/logo3.png"
import { PrivyProvider } from "@privy-io/react-auth"
import { defineChain } from "viem"
import Header from "@/components/header"

// const inter = Inter({ subsets: ["latin"] });
const Sepolia = defineChain({
  id: 11155111,
  name: "Sepolia test network",
  network: "Sepolia test network",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia test network",
    symbol: "SepoliaETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://sepolia.etherscan.io",
    },
  },
})

const LocalNetwork = defineChain({
  id: 31337, // Default Hardhat network ID
  name: "Local Hardhat Network",
  network: "Hardhat",
  nativeCurrency: {
    decimals: 0,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545/"], // URL for local Hardhat network
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://127.0.0.1:8545/", // Replace with your local explorer URL if available
    },
  },
})
// export const metadata = {
//   title: "GitStake",
//   description: "Decentralized Staking Platform",
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>GitStake</title>
        <meta
          name="description"
          content="Decentralized Staking Platform"
        />{" "}
        {/* Use <meta> for descriptions */}
        <link rel="shortcut icon" href={logo.src} type="image/png" />{" "}
        {/* Example favicon usage */}
        <link rel="apple-touch-icon" sizes="180x180" href={logo.src} />
      </head>
      <body>
        <div className={styles.backgroundDiv}>
          <PrivyProvider
            appId="clzik7g9e01qgenjg4zjhj0w9"
            config={{
              appearance: {
                theme: "light",
                accentColor: "#676FFF",
                logo: logo.src, // Correct usage for the logo
              },
              embeddedWallets: {
                createOnLogin: "users-without-wallets",
              },
              defaultChain: Sepolia, // Setting Sepolia as the default chain
              supportedChains: [Sepolia, LocalNetwork], // Supporting both Sepolia and LocalNetwork
            }}
          >
            <Header />
            {children}
          </PrivyProvider>
        </div>
      </body>
    </html>
  )
}
