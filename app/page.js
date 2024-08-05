
import styles from "./styles.module.css";
import Image from 'next/image'
import bg from "../assets/bg3.jpeg"
import logo from "../assets/logo3.png"

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.mainLeft}>
          <div><a style={{ color: "#1ecbe1" }}>S</a>ta<a style={{ color: "var(--divider)" }}>k</a>e. </div>
          <div>S<a style={{ color: "var(--divider)" }}>o</a>lv<a style={{ color: "#1ecbe1" }}>e</a>. </div>
          <div><a style={{ color: "#1ecbe1" }}>E</a>ar<a style={{ color: "var(--divider)" }}>n</a>. </div>
        </div>
        <div className={styles.mainRight}>
          <div style={{ display: "flex", justifyContent: "Center" }}><Image
            src={logo}
            width={250}
            height={250}
          />
          </div>
          Enter your Git Access Token <br></br>
          <input style={{ color:"var(--divider)", fontFamily:"var(--font-lucida)", fontSize:20, height: 40 }}></input>
          <button className={styles.LoginButton} >Log In</button>
        </div>
      </main>
      <Image style={{ position: "absolute", top: 100, left: 60, opacity: 0.15, zIndex: 1, overflow: "hidden" }}
        src={bg}
        width={1300}
      />
    </>
  );
}
