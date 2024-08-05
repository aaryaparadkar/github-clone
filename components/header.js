import styles from "../app/styles.module.css";
import Image from 'next/image'
import profile from "../assets/profile1.jpg"
import logo from "../assets/logo3.png"

export default function Header() {
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.HeaderChild1}>
                    <div>                    
                        <Image
                        src={logo}
                        width={70}
                        height={70}
                    /></div>
                    <div>About</div>
                    <div>Contact</div>
                </div>
                <div className={styles.HeaderChild2}>
                    <span style={{ backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)" }}> Hi! John Doe</span>
                    <Image className={styles.ProfileImg}
                        src={profile}
                        width={100}
                        height={100}
                    />
                    <button className={styles.ConnectButton}>Connect</button>
                    {/* <div className={styles.ConnectButton}btn1><span>Connect</span></div> */}
                </div>
            </div>
            <div className={styles.Divider}>

            </div>
        </>
    );
}