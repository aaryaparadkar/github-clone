"use client"
import { useParams } from "next/navigation"
import styles from "../app/styles.module.css"
import Image from "next/image"
import fork from "../app/assets/fork.png"
import Link from "next/link"

export default function RepoHeader() {
  const { owner, repo } = useParams()
  console.log(owner + repo)
  return (
    <>
      <div className={styles.Header}>
        <div className={styles.HeaderChild1} style={{ gap: 10 }}>
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>

          <span style={{ color: "var(--aqua)" }}>{repo}</span>
        </div>
        <div className={styles.HeaderChild2}>
          <div>Code</div>
          <div>Discussions</div>
          <Link href={`/repository/${owner}/${repo}/issues`}>
            <div>Issues</div>
          </Link>
          <Link href={`/repository/${owner}/${repo}/pulls`}>
            <div>Pull Requests</div>
          </Link>

          {/* <div>Fork</div> */}
          <div style={{ display: "flex", gap: 3 }}>
            <Image src={fork} width={30} height={30} />
            <button className={styles.ForkButton} style={{ width: 70 }}>
              Fork
            </button>
            <input
              style={{
                color: "var(--font)",
                padding: "0 5px",
                background: "var(--button)",
                border: "0.5px solid var(--divider)",
                fontSize: "14px",
              }}
              placeholder="Your Repo Name..."
            ></input>
          </div>
        </div>
      </div>
      <div className={styles.Divider}></div>
    </>
  )
}
