import styles from "../../../../../styles.module.css"
import Image from "next/image"
import merge from "../../../../../assets/merge.png"
import tick from "../../../../../assets/tick.png"

export default function newPullReq() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          padding: "30px 20%",
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>
          <Image
            style={{ transform: "rotate(90deg)" }}
            src={merge}
            width={30}
            height={30}
          />
          <select className={styles.BranchOptions}>
            <option>Main</option>
          </select>
          <div
            style={{
              color: "#40bf63",
              display: "flex",
              justifyContent: "center",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image src={tick} width={30} height={30} />
            Able to Merge
          </div>
        </div>

        <div>
          Set Stake Prize (minimum 0.1 ETH) <br></br>
          <input
            type="number"
            placeholder="ETH Prize"
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          ></input>
        </div>
        <div>
          Add Title<br></br>
          <input
            placeholder="Title"
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          ></input>
        </div>

        <div>
          Fix Issue Number <br></br>
          <input
            placeholder="#<Number>"
            style={{
              color: "var(--font)",
              padding: "0 5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          ></input>
        </div>

        <div>
          Add Description<br></br>
          <textarea
            placeholder="Add your description here..."
            style={{
              minHeight: 150,
              color: "var(--font)",
              padding: "5px",
              width: "750px",
              height: "30px",
              background: "var(--button)",
              border: "0.5px solid var(--divider)",
              fontSize: "14px",
            }}
          ></textarea>
        </div>

        <div>
          <button className={styles.ForkButton} style={{ width: 200 }}>
            {" "}
            Create Pull Request
          </button>
        </div>
      </div>
    </>

    // <table>
    //     <thead>
    //     19 open issues
    //     </thead>
    // </table>
  )
}
