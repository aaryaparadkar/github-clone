"use client"
import profile from "../app/assets/profile1.jpg"
import tick from "../app/assets/tick.png"
import raise from "../app/assets/raise.png"
import remove from "../app/assets/remove.png"
import Image from "next/image"
import styles from "../app/styles.module.css"

export default function SolutionCard() {
  const markedAsAnswer = true

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
          gap: 10,
        }}
      >
        <div style={{ color: "var(--aqua)" }}> Tufayl Dalvi </div>
        <div>
          Staked
          <span
            style={{
              border: "0.5px solid var(--divider)",
              backgroundColor: "rgba(8, 0, 42, 0.389)",
              color: "var(--aqua)",
              padding: 5,
              margin: "0 10px",
              fontSize: 20,
            }}
          >
            9.6 ETH
          </span>
          <Image
            style={{ marginRight: 5 }}
            src={raise}
            width={30}
            height={30}
          />
          <Image src={remove} width={30} height={30} />
        </div>

        <div style={{ fontSize: 12, color: "grey" }}> 27th Feb 2023 </div>
        <div>
          because-- use products?.map then it will render correctly because we
          have fetched the data by sending request to API so first we have to
          check if the "products" existed or not.
        </div>

        <div>
          {markedAsAnswer ? (
            <div style={{ color: "var(--aqua)" }}> Marked as Answer </div>
          ) : (
            <button style={{ borderRadius: "50%" }}>
              <Image
                className={styles.ProfileImg}
                src={tick}
                width={70}
                height={70}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
