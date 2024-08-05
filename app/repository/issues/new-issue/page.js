import styles from "../../../styles.module.css";

export default function newIssue() {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", padding: "30px 20%", gap: 30 }}>
                <div>
                    Set Win Prize (minimum 0.1 ETH) <br></br>
                    <input type="number" placeholder="ETH Prize" style={{ color: "var(--font)", padding: "0 5px", width: "750px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></input>
                </div>
                <div>
                    Add Title<br></br>
                    <input placeholder="Title" style={{ color: "var(--font)", padding: "0 5px", width: "750px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></input>
                </div>

                <div>
                    Add Tags<br></br>
                    <input placeholder="Tags" style={{ color: "var(--font)", padding: "0 5px", width: "750px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></input>
                </div>

                <div>
                    Add Description<br></br>
                    <textarea placeholder="Add your description here..." style={{ minHeight: 150, color: "var(--font)", padding: "5px", width: "750px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></textarea>
                </div>

                <div>
                    <button className={styles.ForkButton} style={{ width: 200 }}>Create New Issue</button>

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