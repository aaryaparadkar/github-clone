import styles from "../../styles.module.css";

export default function PullReq() {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "20px 30px", gap: 50 }}>
                <div>
                    Highest Stake <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 ETH</div>
                </div>
                <div>
                    <input placeholder="Type to Search..." style={{ color: "var(--font)", padding: "0 5px", width: "450px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></input>
                </div>
                <div>
                    <button className={styles.ForkButton} style={{ width:200}}>New Pull Request</button>

                </div>
            </div>
            <div className={styles.IssuesTable}>
                <div style={{ color: "var(--aqua)" }}>19 open pull requests</div>
                <div style={{ color: "var(--aqua)" }}>Win Prize</div>
                <div style={{ color: "var(--aqua)" }}>Milestones</div>
                <div style={{ color: "var(--aqua)" }}>Assignee</div>
                <div style={{ color: "var(--aqua)" }}>Stakes</div>
                <div style={{ color: "var(--aqua)" }}>Reviews</div>

                <div style={{ height: 0.1, gridColumnStart: 1, gridColumnEnd: 7, backgroundColor: "var(--divider)" }}></div>

                <div style={{ paddingLeft: 20, display: "flex", margin: 0, flexDirection: "column", justifyContent: "left" }}>
                    <span style={{ color: "var(--aqua)", fontSize: 20 }} >#456</span> not working
                    <span>Posted by Manas Mishra</span>
                </div>


                <div>5 ETH</div>
                <div> initial</div>
                <div> abc</div>
                <div> 5</div>
                <div>
                    2
                </div>

                <div style={{ height: 0.1, gridColumnStart: 1, gridColumnEnd: 7, backgroundColor: "var(--divider)" }}></div>


            </div>
        </>

        // <table>
        //     <thead>
        //     19 open issues
        //     </thead>
        // </table>

    )
}