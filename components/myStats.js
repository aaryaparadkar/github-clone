import styles from "../app/styles.module.css";

export default function MyStatsCard() {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}>My Statistics Card</div>
            <div className={styles.MyStatsContainer}>
                <div>
                    Withdraw Proceedings <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 ETH</div>
                </div>
                <div>
                    <button className={styles.WithdrawButton}>Withdraw</button>
                </div>
                <div style={{ maxHeight: 0.1, gridColumnStart: 1, gridColumnEnd: 3, backgroundColor: "var(--divider)" }}></div>
                <div>
                    Total Stakes <div style={{ color: "var(--aqua)", fontSize: 20 }}>4</div>
                </div>
                <div>Total Staked ETH <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 ETH</div> </div>
                <div>Total Earnings <div style={{ color: "var(--aqua)", fontSize: 20 }}>0.4 ETH</div></div>
                <div>Reward Rate <div style={{ color: "var(--aqua)", fontSize: 20 }}>10%</div> </div>
                <div style={{ maxHeight: 0.1, gridColumnStart: 1, gridColumnEnd: 3, backgroundColor: "var(--divider)" }}></div>
                <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>Analysis</div>

            </div>
        </>
    )
}


