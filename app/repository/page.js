import styles from "../styles.module.css"
export default function Repository() {
    return (
        <>
            <div className={styles.CodeTable}>
                <div style={{  color: "var(--aqua)" }}>FileName</div>
                <div style={{  color: "var(--aqua)" }}>Commit</div>
                {/* <div style={{ height: 0.1, gridColumnStart: 1, gridColumnEnd: 2, backgroundColor: "var(--divider)" }}></div> */}

                <div style={{display:"flex", gap:10, flexDirection:"column", justifyContent:"left", alignItems:"flex-start"}}>
                    <div>abc.js</div>
                    <div>ssss</div>
                </div>
                <div> initial</div>
            </div>

        </>
    )
}