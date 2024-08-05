// import SolutionCard from "@/components/SolutionCard";
import styles from "../../../styles.module.css";
import DiscussionCard from "@/components/discussionCard";
// import PostDoubt from "@/components/postDoubt";
// import PostSolution from "@/components/postSolution";
import PullReqCard from "@/components/pullRequestCard";
// import Image from "next/image";
// import raise from "../../../../assets/raise.png"
// import remove from "../../../../assets/remove.png"

export default function Pull() {
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", padding: "10px 3rem 0 3rem", fontSize: 24 }}>
                <div style={{ color: "var(--aqua)", paddingRight: 10 }}>
                    #467
                    <span style={{ paddingLeft: 5, marginLeft: 5, fontSize: 16, color: "var(--font)", backgroundColor: "green", padding: 2 }}>
                        Open
                    </span>
                </div>
                issue#27 Bhai yeh thik kr diyay dekhle
            </div>
            <div style={{ padding: "10px 3rem", alignItems: "center", display: "flex", flexDirection: "row", }}>
                Staked  <div style={{ border: "0.5px solid var(--divider)", backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, marginLeft: 5, marginRight: 5, fontSize: 20 }}>
                    5 ETH
                </div>
                -
                <div style={{ color: "var(--aqua)", padding: 5, marginLeft: 3 }}>
                    ManasMishra
                </div>
                wants to merge 1 commit into
                <div style={{ backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, marginLeft: 3 }}>
                    basir:master
                </div>
                from
                <div style={{ backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)", padding: 5, marginLeft: 3 }}>
                    ManasMishra:fix/issue-27-remove-deprecated
                </div>

            </div>
            <div style={{ height: 0.1, marginLeft: "3%", width: "94vw", backgroundColor: "var(--divider)" }}></div>

            <div className={styles.IssueContainer}>
                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }} >
                    Conversations(16)
                </div>
                <div style={{ height: "auto", width: 0.1, gridColumnStart: 2, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 100, backgroundColor: "var(--divider)" }}></div>

                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}  >
                    Commits(5)
                </div>
                <div style={{ height: "auto", width: 0.1, gridColumnStart: 4, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 4, backgroundColor: "var(--divider)" }}></div>

                <div style={{ display: "flex", justifyContent: "center", color: "var(--aqua)" }}  >
                    Files Changed(2)
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <DiscussionCard />
                    {/* <DiscussionCard /> */}
                    {/* <PostDoubt /> */}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <PullReqCard />

                </div>

                <div style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 10 }}>
                    <ol>
                        <li>
                            abc.js/abc/abc
                        </li>
                        <li>
                            abc.js/abc/abc
                        </li>
                    </ol>
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