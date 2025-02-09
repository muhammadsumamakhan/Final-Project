import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { db } from "../config/firebase/config";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const InstaPost = () => {
    const [posts, setPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [usernames, setUsernames] = useState({});
    const [loading, setLoading] = useState(true);

    const currentUser = "IahvI5xM1WgLNkPQU9yN957FJZi2"; // Example User ID

    useEffect(() => {
        const q = query(collection(db, "InstaPosts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const postData = doc.data();
                return {
                    id: doc.id,
                    ...postData,
                    createdAt: postData.createdAt?.toDate() || new Date(),
                    likes: postData.likes || [],
                    comments: postData.comments || [],
                    userName: postData.userName || "Unknown User",
                    userProfile: postData.userProfile || "/default-user.png",
                };
            });

            // Fetch unique user IDs from comments
            const userIds = new Set(
                fetchedPosts.flatMap((post) => post.comments.map((c) => c.userId))
            );

            const userPromises = [...userIds].map(async (userId) => {
                const userDoc = await getDoc(doc(db, "Users", userId));
                return {
                    userId,
                    username: userDoc.exists() ? userDoc.data().username : "Unknown User",
                };
            });

            const usersData = await Promise.all(userPromises);
            const userMap = Object.fromEntries(
                usersData.map(({ userId, username }) => [userId, username])
            );

            setUsernames(userMap);
            setPosts(fetchedPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Handle Like Toggle
    const handleLike = async (postId, likes) => {
        const postRef = doc(db, "InstaPosts", postId);
        if (likes.includes(currentUser)) {
            await updateDoc(postRef, { likes: arrayRemove(currentUser) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(currentUser) });
        }
    };

    // Handle Comment Submit
    const handleCommentSubmit = async (postId) => {
        if (!commentTexts[postId]?.trim()) return;

        const postRef = doc(db, "InstaPosts", postId);
        await updateDoc(postRef, {
            comments: arrayUnion({
                userId: currentUser,
                text: commentTexts[postId],
                timestamp: new Date(),
            }),
        });

        setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
    };

    return (
        <div>
            {loading ? (
                <p className="text-center text-gray-500 mt-5">Loading posts...</p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500 mt-5">No posts available</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 shadow rounded-lg mb-5">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <img
                                src={post.userProfile}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h2 className="font-semibold text-gray-800">{post.userName}</h2>
                                <p className="text-sm text-gray-500">
                                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* Post Content */}
                        <p className="mt-3">{post.text || ""}</p>

                        {post.imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                                <img src={post.imageUrl} alt="Post" className="w-full object-cover" />
                            </div>
                        )}

                        {/* Likes, Comments, and Shares */}
                        <div className="flex items-center justify-between mt-3 text-gray-600 text-sm">
                            <p>{post.comments.length} Comments • {post.likes.length} Likes</p>
                        </div>

                        {/* Like, Comment, Share Buttons */}
                        <div className="border-t pt-3 mt-3 flex justify-between text-gray-600">
                            <button
                                className="flex items-center space-x-1 hover:text-blue-500"
                                onClick={() => handleLike(post.id, post.likes)}
                            >
                                {post.likes.includes(currentUser) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                <span>Like</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-500">
                                <FaRegComment />
                                <span>Comments</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-500">
                                <FaShare />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Comment Box */}
                        <div className="border-t pt-3 mt-3 flex items-center">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 ml-2"
                                value={commentTexts[post.id] || ""}
                                onChange={(e) =>
                                    setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                            />
                            <button
                                className="p-2 bg-pink-500 text-white rounded-full ml-2"
                                onClick={() => handleCommentSubmit(post.id)}
                            >
                                <IoSend />
                            </button>
                        </div>

                        {/* Comments List */}
                        {post.comments.map((comment, index) => (
                            <div key={index} className="flex items-start space-x-3 mt-4 p-3 rounded-lg bg-gray-100">
                                {/* Commenter's Profile Picture */}
                                <img
                                    src={comment.userProfile || "/default-user.png"} // Show default if no profile is set
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                                {/* Commenter's Name */}
                                <span className="font-semibold text-sm text-gray-700">
                                    {usernames[comment.userId] || "Unknown User"}  {/* Get the name from the usernames map */}
                                </span>
                                {/* Comment Text */}
                                <p className="mt-1 text-sm text-gray-800">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default InstaPost;
