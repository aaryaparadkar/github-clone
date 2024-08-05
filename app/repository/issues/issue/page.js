import SolutionCard from "@/components/SolutionCard";
import styles from "../../../styles.module.css";
import DiscussionCard from "@/components/discussionCard";
import PostDoubt from "@/components/postDoubt";
import PostSolution from "@/components/postSolution";
import PullReqCard from "@/components/pullRequestCard";
import Image from "next/image";
import raise from "../../../../assets/raise.png"
import remove from "../../../../assets/remove.png"

export default function Issue() {
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", padding: "10px 3rem 0 3rem", fontSize: 24 }}>
                <div style={{ color: "var(--aqua)", paddingRight: 10 }}>
                    #467
                    <span style={{ paddingLeft: 5, marginLeft: 5, fontSize: 16, color: "var(--font)", backgroundColor: "green", padding: 2 }}>
                        Open
                    </span>
                </div>
                Bhai chlra hi naiye...
            </div>
            <div style={{ padding: "10px 3rem", alignItems: "center", display: "flex", flexDirection: "row", }}>
                Win Prize
                <div style={{ border: "0.5px solid var(--divider)", backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, marginLeft: 10, marginRight:10, fontSize: 20 }}>
                    0.4 ETH
                </div>
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

                - Highest Stake by <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}>
                    Tufayl Dalvi
                </div>
                <div style={{ border: "0.5px solid var(--divider)", backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, marginLeft: 10, marginRight: 30, fontSize: 20 }}> 9.6 ETH </div>
                - Opened on 27th Feb 2023 by
                <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 5 }}> Aarya Paradkar </div>
            </div>
            <div style={{ height: 0.1, marginLeft: "3%", width: "94vw", backgroundColor: "var(--divider)" }}></div>

            <div className={styles.IssueContainer}>
                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }} >
                    Conversations(16)
                </div>
                <div style={{ height: "auto", width: 0.1, gridColumnStart: 2, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 100, backgroundColor: "var(--divider)" }}></div>

                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}  >
                    Solutions(5)
                </div>
                <div style={{ height: "auto", width: 0.1, gridColumnStart: 4, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 4, backgroundColor: "var(--divider)" }}></div>

                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}  >
                    Linked Pull Requests(2)
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <DiscussionCard />
                    {/* <DiscussionCard /> */}
                    <PostDoubt />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <SolutionCard />
                    <PostSolution />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <PullReqCard />
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