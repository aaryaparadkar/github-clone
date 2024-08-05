import MyStatsCard from "@/components/myStats";
import styles from "../styles.module.css";
import ChatBot from "@/components/chatbot";
// import Image from 'next/image'

export default function Dashboard() {
    return (
        <>
            <main className={styles.DashboardMain}>
                <div className={styles.searchBar}>
                    <input placeholder="Type to Search..." style={{ color:"var(--font)", padding: "0 5px", width: "450px", height: "30px", background: "var(--button)", border: "0.5px solid var(--divider)", fontSize: "14px" }}></input>
                </div>
                <div className={styles.YourRepos}>
                    <div style={{ display:"flex", justifyContent:"center", color: "var(--aqua)" }}>My Repositories</div>
                    <div className={styles.YourReposContainer}>
                        <div>Repo1</div>
                        <div>Repo1</div>
                        <div>Repo1</div>
                        <div>Repo1</div>
                    </div>
                </div>
                <div >
                    <MyStatsCard/>
                </div>
                <div>
                    <div style={{ display:"flex", justifyContent:"center", color: "var(--aqua)" }}>  Chatbot AI</div>
                    <ChatBot/>
                </div>
            </main>
        </>
    )
}