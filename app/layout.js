// import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./styles.module.css";
import Header from "../components/header.js";
// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GitStake",
  description: "Decentralized Staking Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="shortcut icon" href="../assets/logo3.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="../assets/logo3.pngg" />
        <link rel="icon" type="image/png" sizes="32x32" href="../assets/logo3.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="../assets/logo3.png" />
      </head> */}
      <body>
        <div className={styles.backgroundDiv}>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
