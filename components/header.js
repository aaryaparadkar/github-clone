"use client"
import styles from "../app/styles.module.css"
import Image from "next/image"
import profile from "../app/assets/profile1.jpg"
import logo from "../app/assets/logo3.png"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function Header() {
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [user, setUser] = useState("")
  // const address = ready ? wallets[0]?.address : ""

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("githubAccessToken")
      if (!token) {
        console.log("GitHub access token not found.")
        return
      }

      try {
        const response = await fetch(`https://api.github.com/user`, {
          method: "GET",
          headers: {
            Authorization: `token ${token}`,
          },
        })

        if (response.ok) {
          const user = await response.json()
          setUser(user)
          console.log("User", user)
        } else {
          const errorData = await response.json()
          console.log("Error at", errorData.message)
        }
      } catch (error) {
        console.log("Error during forking:", error)
      }
    }
    getUser()
  }, [])

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.HeaderChild1}>
          <div>
            <Image src={logo} width={70} height={70} />
          </div>
          <Link href={"/dashboard"}>
            <div>Dashboard</div>
          </Link>

          <div>Contact</div>
        </div>
        <div className={styles.HeaderChild2}>
          <span
            style={{
              backgroundColor: "rgba(8, 0, 42, 0.389)",
              color: "var(--aqua)",
            }}
          >
            {" "}
            Hiii! {user ? user?.login : "User"}
          </span>
          <Image
            className={styles.ProfileImg}
            src={profile}
            width={100}
            height={100}
          />
          {authenticated ? (
            <button className={styles.ConnectButton} onClick={logout}>
              Disconnect
            </button>
          ) : (
            <button className={styles.ConnectButton} onClick={login}>
              Connect
            </button>
          )}
          {/* <div className={styles.ConnectButton}btn1><span>Connect</span></div> */}
        </div>
      </div>
      <div className={styles.Divider}></div>
    </>
  )
}
