"use client";
import Image from 'next/image';
import styles from "../../styles.module.css";

export default function RequestTokens() {
    return (
        <div style={{ height: 690, overflowY: "auto", padding: "20px" }}>
            <p>
                An ICO (Initial Coin Offering) is a way for companies or projects to raise money by selling a new cryptocurrency or token to the public. It’s similar to how companies raise money by offering shares in an IPO (Initial Public Offering).
            </p>
            <br></br>
            <h3><strong>How It Works:</strong></h3>
            <ul>
                <li>Project or Company creates a new cryptocurrency or token, often based on blockchain technology like Ethereum.</li>
                <li>They announce an ICO and offer these tokens for sale, usually in exchange for established cryptocurrencies like Bitcoin or Ether, or even traditional money.</li>
                <li>Investors buy these tokens, believing the project will succeed and the value of the tokens will rise.</li>
                <li>If the project is successful, the tokens could become valuable and tradeable in the future.</li>
            </ul>
            <br></br>

            <h3><strong>Why People Participate:</strong></h3>
            <p>
                Projects use ICOs to fund development and launch new technologies, platforms, or services.
                Investors participate, hoping that the tokens they buy will increase in value if the project succeeds.
            </p>
            <br></br>

            {/* <h3>Risks:</h3>
            <ul>
                <li><strong>High Risk:</strong> Many ICOs fail, and investors could lose money.</li>
                <li><strong>Regulation:</strong> ICOs are often unregulated, so it's important to research thoroughly before investing.</li>
            </ul> */}

            <p>
                In summary, an ICO is a way for new projects to raise funds by selling tokens, but it's risky because many projects don't succeed.
            </p>

            <button
                className={styles.ForkButton}
                style={{ width: 200, marginTop: 30 }}
            >
                Collect 10 Free GST
            </button>
        </div>
    );
}
