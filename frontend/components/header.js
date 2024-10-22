"use client"
import styles from "../app/styles.module.css";
import Image from 'next/image'
import profile from "../assets/profile1.jpg"
import logo from "../assets/logo3.png"
import Link from "next/link";


export default function Header({ connectFunction, account }) {
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
                    <Link href={`/dashboard`}><div>Dashboard</div></Link>
                    <Link href={`/resume`}><div>My Statistics</div></Link>
                    <Link href={`https://discord.gg/RemgRwM5`}><div>Community</div></Link>
                    <Link href={`/docs`}><div>Docs</div></Link>
                </div>
                <div className={styles.HeaderChild2}>
                    {
                        !(account == 0x00) ?
                            <span style={{ backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)" }}>
                                Hi! {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                            </span> :
                            <span style={{ backgroundColor: "rgba(8, 0, 42, 0.389)", color: "var(--aqua)" }}>
                                Please Connect Wallet
                            </span>
                    }


                    <Image className={styles.ProfileImg}
                        src={profile}
                        width={90}
                        height={100}
                    />
                    <button className={styles.ConnectButton} onClick={connectFunction}>
                        {(account == 0x00) ? "Connect" : "Connected"}
                    </button>
                    {/* <div className={styles.ConnectButton}btn1><span>Connect</span></div> */}
                </div>
            </div>
            <div className={styles.Divider}>

            </div>
        </>
    );
}