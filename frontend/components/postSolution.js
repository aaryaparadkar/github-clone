"use client"
import profile from "../app/assets/profile1.jpg"
import Image from "next/image"
import styles from "../app/styles.module.css"

export default function PostSolution() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 7,
        marginRight: 10,
        backgroundColor: "var(--button)",
        border: "0.5px solid var(--divider)",
      }}
    >
      <Image
        className={styles.ProfileImg}
        src={profile}
        width={70}
        height={70}
      />

      <div
        style={{
          display: "flex",
          padding: 10,
          flexDirection: "column",
          gap: 5,
        }}
      >
        <div>Add Doubt</div>
        {/* <div style={{ fontSize: 12, color: "grey" }}> 27th Feb 2023 </div> */}
        <div style={{ fontSize: 12, color: "grey" }}>
          (0.1 ETH will be charged)
        </div>
        <textarea
          placeholder="Your doubt..."
          style={{ padding: 4, minHeight: 100, maxWidth: 350, minWidth: 350 }}
        ></textarea>
        <button className={styles.ForkButton}>Submit</button>
      </div>
    </div>
  )
}
