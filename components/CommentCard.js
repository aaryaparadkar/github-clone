"use client"
import profile from "../app/assets/profile1.jpg"
// import tick from "../app/assets/tick.png"
// import raise from "../app/assets/raise.png"
// import remove from "../app/assets/remove.png"
import Image from "next/image"
import styles from "../app/styles.module.css"
import PostComment from "@/components/postComment"

import { useEffect, useState } from "react"

export default function CommentCard({ comments_url }) {
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("githubAccessToken")
        if (!token) {
          console.error("GitHub access token not found.")
          return
        }

        const commentsResponse = await fetch(comments_url, {
          headers: {
            Authorization: `token ${token}`,
          },
        })

        if (commentsResponse.ok) {
          const data = await commentsResponse.json()
          setComments(data)
        } else {
          console.error(
            "Failed to fetch comments:",
            commentsResponse.statusText,
          )
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchComments()
  }, [comments_url])
  const addComment = (newComment) => {
    setComments([newComment, ...comments])
  }

  return (
    <>
      {comments.length > 0
        ? comments.map((comment) => (
            <div
              key={comment.id}
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
                alt="User Profile"
              />

              <div
                style={{
                  display: "flex",
                  padding: 10,
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ color: "var(--aqua)" }}>{comment.user.login}</div>
                {/* <div>
                Staked
                <span
                  style={{
                    border: "0.5px solid var(--divider)",
                    backgroundColor: "rgba(8, 0, 42, 0.389)",
                    color: "var(--aqua)",
                    padding: 5,
                    margin: "0 10px",
                    fontSize: 20,
                  }}
                >
                  9.6 ETH
                </span>
                <Image
                  style={{ marginRight: 5 }}
                  src={raise}
                  width={30}
                  height={30}
                  alt="Raise"
                />
                <Image src={remove} width={30} height={30} alt="Remove" />
              </div> */}
                <div style={{ fontSize: 12, color: "grey" }}>
                  {new Date(comment.created_at).toLocaleDateString()}{" "}
                  {/* Display comment creation date */}
                </div>
                <div>{comment.body}</div> {/* Display comment body */}
                <div>
                  {/* {comment.markedAsAnswer ? ( // Use actual condition for "Marked as Answer" status
                  <div style={{ color: "var(--aqua)" }}>Marked as Answer</div>
                ) : (
                  <button style={{ borderRadius: "50%" }}>
                    <Image
                      className={styles.ProfileImg}
                      src={tick}
                      width={70}
                      height={70}
                      alt="Mark as Answer"
                    />
                  </button>
                )} */}
                </div>
              </div>
            </div>
          ))
        : ""}
      <PostComment comments_url={comments_url} addComment={addComment} />
    </>
  )
}
