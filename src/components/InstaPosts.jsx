import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase/config";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";

const InstaPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const q = query(collection(db, "InstaPosts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate
                            ? data.createdAt.toDate()  // Convert Firestore Timestamp
                            : new Date()  // Fallback to current date
                    };
                })
            );
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Function to Handle Like
    const handleLike = async (postId) => {
        if (!auth.currentUser) return alert("Login to like posts!");

        const user = auth.currentUser;
        const postRef = doc(db, "InstaPosts", postId);

        await updateDoc(postRef, {
            likes: arrayUnion({
                userId: user.uid,
                userName: user.displayName || "Anonymous",
                userProfile: user.photoURL || "/default-avatar.png",
            }),
        });
    };

    // Function to Handle Comment
    const handleComment = async (postId) => {
        if (!auth.currentUser) return alert("Login to comment!");

        const user = auth.currentUser;
        const postRef = doc(db, "InstaPosts", postId);

        if (commentText.trim() === "") return alert("Comment cannot be empty!");

        await updateDoc(postRef, {
            comments: arrayUnion({
                userId: user.uid,
                userName: user.displayName || "Anonymous",
                userProfile: user.photoURL || "/default-avatar.png",
                text: commentText,
                createdAt: Timestamp.now(), // Store as Firestore Timestamp
            }),
        });

        setCommentText(""); // Reset Comment Input
    };

    return (
        <div className="max-w-2xl mx-auto">
            {loading ? (
                <p className="text-center text-gray-500 mt-5 animate-pulse">Loading posts...</p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500 mt-5">No posts available</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 shadow-md rounded-lg mb-5">
                        {/* Post Header */}
                        <div className="flex items-center space-x-3">
                            <img
                                src={post.userProfile || "/default-avatar.png"}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h2 className="font-semibold text-gray-800">{post.userName || "Unknown User"}</h2>
                                <p className="text-sm text-gray-500">
                                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* Post Content */}
                        {post.text && <p className="mt-3 text-gray-700">{post.text}</p>}
                        {post.imageUrl && <img src={post.imageUrl} alt="Post" className="mt-3 rounded-lg w-full" />}

                        {/* Like & Comment Section */}
                        <div className="mt-3 flex items-center space-x-4">
                            <button
                                onClick={() => handleLike(post.id)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                👍 Like ({post.likes?.length || 0})
                            </button>

                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => document.getElementById(`comment-${post.id}`).focus()}
                            >
                                💬 Comment ({post.comments?.length || 0})
                            </button>
                        </div>

                        {/* Comment Input */}
                        <div className="mt-3 flex">
                            <input
                                id={`comment-${post.id}`}
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="border border-gray-300 rounded-lg p-2 flex-grow"
                            />
                            <button
                                onClick={() => handleComment(post.id)}
                                className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
                            >
                                Post
                            </button>
                        </div>

                        {/* Comments List */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="mt-3 bg-gray-100 p-3 rounded-lg">
                                {post.comments.map((comment, index) => (
                                    <div key={index} className="flex items-start space-x-3 mb-2">
                                        <img
                                            src={comment.userProfile || "/default-avatar.png"}
                                            alt="User"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold">{comment.userName}</p>
                                            <p className="text-sm text-gray-700">{comment.text}</p>
                                            <p className="text-xs text-gray-500">
                                                {comment.createdAt?.toDate
                                                    ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })
                                                    : formatDistanceToNow(new Date(comment.createdAt || Date.now()), { addSuffix: true })
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default InstaPost;
