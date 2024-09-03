"use client"
import profile from "../app/assets/profile1.jpg"
import Image from "next/image"
import styles from "../app/styles.module.css"
import { useState } from "react"

export default function PostComment({ comments_url, addComment }) {
  const [comment, setComment] = useState("") // State for the comment input
  const [loading, setLoading] = useState(false) // State for loading status
  const [error, setError] = useState("") // State for error messages

  const handleCommentChange = (e) => {
    setComment(e.target.value) // Update the comment state with the input value
  }

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty.")
      return
    }

    setLoading(true)
    setError("") // Clear any previous errors

    try {
      const token = localStorage.getItem("githubAccessToken")
      if (!token) {
        setError("GitHub access token not found.")
        setLoading(false)
        return
      }

      const response = await fetch(comments_url, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: comment }), // Sending the comment text
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Comment added:", data)
        addComment(data)
        setComment("") // Clear the textarea after successful submission
      } else {
        setError("Failed to add comment.")
        console.error("Failed to add comment:", response.statusText)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Error adding comment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 7,
        marginRight: 10,
        backgroundColor: "var(--button)",
        border: "0.5px solid var(--divider)",
      }}
    >
      <Image
        className={styles.ProfileImg}
        src={profile}
        width={70}
        height={70}
        alt="Profile"
      />

      <div
        style={{
          display: "flex",
          padding: 10,
          flexDirection: "column",
          gap: 5,
        }}
      >
        <div>Add Comment</div>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Your comment..."
          style={{ padding: 4, minHeight: 100, maxWidth: 350, minWidth: 350 }}
        ></textarea>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Display error message if any */}
        <button
          className={styles.ForkButton}
          onClick={handleSubmit}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  )
}

// "use client"
// import profile from "../app/assets/profile1.jpg"
// import Image from "next/image"
// import styles from "../app/styles.module.css"

// export default function PostComment(comments_url) {
//   console.log(comments_url)
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         padding: 7,
//         marginRight: 10,
//         backgroundColor: "var(--button)",
//         border: "0.5px solid var(--divider)",
//       }}
//     >
//       <Image
//         className={styles.ProfileImg}
//         src={profile}
//         width={70}
//         height={70}
//       />

//       <div
//         style={{
//           display: "flex",
//           padding: 10,
//           flexDirection: "column",
//           gap: 5,
//         }}
//       >
//         <div>Add Comment</div>
//         {/* <div>
//           Stake Amount{" "}
//           <input
//             placeholder="Minimum 0.5 ETH"
//             type="number"
//             style={{ height: 30 }}
//           ></input>
//         </div> */}
//         {/* <div style={{ fontSize: 12, color: "grey" }}> 27th Feb 2023 </div> */}
//         <textarea
//           placeholder="Your Comment..."
//           style={{ padding: 4, minHeight: 100, maxWidth: 350, minWidth: 350 }}
//         ></textarea>
//         <button className={styles.ForkButton}>Submit</button>
//       </div>
//     </div>
//   )
// }
