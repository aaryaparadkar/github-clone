import profile from "../assets/profile1.jpg"
import raise from "../assets/raise.png"
import remove from "../assets/remove.png"
import Image from "next/image";
import styles from "../app/styles.module.css"

export default function PullReqCard() {
    const markedAsAnswer = false;

    return (
        <div style={{ display: "flex", flexDirection: "row", padding: 7, marginRight: 10, backgroundColor: "var(--button)", border: "0.5px solid var(--divider)" }}>
            <Image className={styles.ProfileImg}
                src={profile}
                width={70}
                height={70}
            />

            <div style={{ display: "flex", padding: 10, flexDirection: "column", gap: 10 }}>
                <div style={{ color: "var(--aqua)" }}> Manas Mishra </div>
                <div>
                    Staked
                    <span style={{ border: "0.5px solid var(--divider)", backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, margin: "0 10px", fontSize: 20 }}>
                        5 ETH
                    </span>
                    <span style={{ marginRight: 5 , backgroundColor: "green", padding: 2 }}>
                        Open
                    </span>
                    <Image style={{ marginRight: 5 }}
                        src={raise}
                        width={30}
                        height={30}
                    />
                    <Image style={{ marginRight: 15 }}
                        src={remove}
                        width={30}
                        height={30}
                    />
                </div>
                <div style={{ fontSize: 12, color: "grey" }}> 27th Feb 2023 </div>
                <div>
                    <div style={{ color: "var(--aqua)", paddingRight: 10 }}>
                        #468
                    </div>
                    issue#27 remove-deprecated
                </div>

                <div>
                    {
                        markedAsAnswer ?
                            <div style={{ color: "var(--aqua)" }} > Merged </div>
                            :
                            <button className={styles.ForkButton}>Merge</button>

                    }


                </div>
            </div>
        </div>
    )
}
