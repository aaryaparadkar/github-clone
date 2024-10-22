"use client"

import { useRouter } from "next/navigation" // Import useRouter for navigation
import { useState } from "react" // Import useState to handle input state
import styles from "../app/styles.module.css"
import Image from "next/image"
import bg from "./assets/bg3.jpeg"
import logo from "./assets/logo3.png"
import ChatBot from "@/components/chatbot"

export default function Home() {
  const router = useRouter() // Initialize useRouter
  const [token, setToken] = useState("") // State to hold the GitHub token input

  const handleLogin = () => {
    if (token) {
      localStorage.setItem("githubAccessToken", token) // Store the token in localStorage
      router.push("/dashboard") // Navigate to the dashboard
    } else {
      alert("Please enter a GitHub access token.") // Alert user if no token is entered
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.mainLeft}>
          <div>
            <a style={{ color: "#1ecbe1" }}>S</a>ta
            <a style={{ color: "var(--divider)" }}>k</a>e.{" "}
          </div>
          <div>
            S<a style={{ color: "var(--divider)" }}>o</a>lv
            <a style={{ color: "#1ecbe1" }}>e</a>.{" "}
          </div>
          <div>
            <a style={{ color: "#1ecbe1" }}>E</a>ar
            <a style={{ color: "var(--divider)" }}>n</a>.{" "}
          </div>
        </div>
        <div className={styles.mainRight}>
          <div style={{ display: "flex", justifyContent: "Center" }}>
            <Image src={logo} width={250} height={250} alt="GitStake Logo" />
          </div>
          Enter your GitHub Access Token <br />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)} // Update state on input change
            style={{
              color: "var(--divider)",
              fontFamily: "var(--font-lucida)",
              fontSize: 20,
              height: 40,
              width: "80%", // Ensure a consistent size for the input
              marginTop: 10, // Added margin for spacing
            }}
          />
          <button className={styles.LoginButton} onClick={handleLogin}>
            Log In
          </button>
        </div>
      </main>
      <Image
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          opacity: 0.15,
          zIndex: 1,
          overflow: "hidden",
        }}
        src={bg}
        width={1300}
        alt="Background"
      />
    </>
  )
}
