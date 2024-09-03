"use client"
import profile from "../app/assets/profile1.jpg"
import Image from "next/image"
import styles from "../app/styles.module.css"

export default function DescriptionCard({ issue }) {
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

      <div style={{ display: "flex", padding: 10, flexDirection: "column" }}>
        <div style={{ color: "var(--aqua)", marginBottom: 10 }}>
          {" "}
          {issue?.user.login}{" "}
        </div>
        <div style={{ marginBottom: 10, fontSize: 12, color: "grey" }}>
          {" "}
          {new Date(issue?.created_at).toLocaleDateString()}{" "}
        </div>
        <div>{issue?.body}</div>
      </div>
    </div>
  )
}
