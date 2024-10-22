"use client"
import Image from 'next/image'
import roadmap from "../../assets/blockchain-roadmap.png"
import styles from "../styles.module.css"

export default function Dashboard() {
    return (
        <div style={{ height: 690, overflowY: "auto" }}>
            <Image
                src={roadmap}
                width={1000}
                height={100}
            />

            <button
                className={styles.ForkButton}
                style={{ width: 200, marginTop: 30 }}
            >Collect 10 Free GST</button>
        </div>
    )
}