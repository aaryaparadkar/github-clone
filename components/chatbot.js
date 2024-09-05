import { useState } from 'react';
import styles from "../app/styles.module.css";

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput(''); // Reset input field
        }
    };

    return (
        <div className={styles.chatbotContainer}>
            <div className={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${
                            msg.sender === 'user' ? styles.userMessage : styles.botMessage
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.inputField}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage} className={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
}
