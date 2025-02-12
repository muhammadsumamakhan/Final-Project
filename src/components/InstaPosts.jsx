import React, { useState, useEffect } from "react";
import {
    FaRegHeart,
    FaRegComment,
    FaRegShareSquare,
    FaRegBookmark,
    FaHeart,
} from "react-icons/fa";
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
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const InstaPost = ({ currentUser }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const q = query(collection(db, "InstaPosts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const postData = doc.data();
                return {
                    id: doc.id,
                    ...postData,
                    createdAt: postData.createdAt?.toDate?.() || new Date(),
                    userName: postData.userName || "Unknown User",
                    userProfile: postData.userProfile || "/default-user.png",
                    likes: postData.likes ?? [],
                    comments: postData.comments ?? [],
                };
            });

            setPosts(fetchedPosts);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Function to handle Like & Unlike
    const toggleLike = async (postId, isLiked) => {
        if (!currentUser?.uid) {
            alert("Please login to like the post!");
            return;
        }

        const postRef = doc(db, "InstaPosts", postId);

        try {
            await updateDoc(postRef, {
                likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
            });
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    // Function to add a comment
    const addComment = async (postId) => {
        if (!newComment.trim()) return;
        if (!currentUser?.uid) {
            alert("Please login to comment!");
            return;
        }

        const postRef = doc(db, "InstaPosts", postId);

        try {
            await updateDoc(postRef, {
                comments: arrayUnion({
                    userName: currentUser.displayName || "Anonymous",
                    userProfile: currentUser.photoURL || "/default-user.png",
                    text: newComment,
                    createdAt: new Date(),
                }),
            });
            setNewComment(""); // Clear input field
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // Function to open modal (likes or comments)
    const openModal = (post, type) => {
        setSelectedPost(post);
        setModalType(type);
    };

    // Function to close modal
    const closeModal = () => {
        setSelectedPost(null);
        setModalType(null);
    };

    return (
        <div>
            {loading ? (
                <p className="text-center text-gray-500 mt-5 animate-pulse">
                    Loading posts...
                </p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500 mt-5">No posts available</p>
            ) : (
                posts.map((post) => {
                    const isLiked = currentUser && post.likes.includes(currentUser.uid);

                    return (
                        <div key={post.id} className="bg-white p-4 shadow rounded-lg mb-5">
                            {/* User Info */}
                            <div className="flex items-center space-x-3">
                                <img
                                    src={post.userProfile}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-800">
                                        {post.userName}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {formatDistanceToNow(post.createdAt, {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Post Content */}
                            {post.text && (
                                <p className="mt-3 text-gray-700 break-words">{post.text}</p>
                            )}

                            {post.imageUrl && (
                                <div className="mt-3 rounded-lg overflow-hidden">
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}

                            {/* Icons Section */}
                            <div className="border-t pt-3 mt-3 flex items-center justify-between text-gray-700">
                                <div className="flex items-center space-x-4">
                                    <button
                                        className="text-2xl hover:opacity-80 cursor-pointer"
                                        onClick={() => toggleLike(post.id, isLiked)}
                                    >
                                        {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />} {post.likes.length}
                                    </button>
                                    <button
                                        className="text-2xl hover:opacity-80 cursor-pointer"
                                        onClick={() => openModal(post, "comments")}
                                    >
                                        <FaRegComment /> {post.comments.length}
                                    </button>
                                    <button className="text-2xl hover:opacity-80 cursor-pointer">
                                        <FaRegShareSquare />
                                    </button>
                                </div>

                                <button className="text-2xl hover:opacity-80 cursor-pointer">
                                    <FaRegBookmark />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Modal for Likes/Comments */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-3">
                            {modalType === "likes" ? "Liked by" : "Comments"}
                        </h2>
                        <div className="max-h-60 overflow-y-auto">
                            {modalType === "likes"
                                ? selectedPost.likes.map((uid, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <img src="/default-user.png" className="w-8 h-8 rounded-full" alt="User" />
                                        <p className="text-gray-700">User {uid}</p>
                                    </div>
                                ))
                                : selectedPost.comments.map((comment, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <img src={comment.userProfile} className="w-8 h-8 rounded-full" alt="User" />
                                        <div>
                                            <p className="font-bold">{comment.userName}</p>
                                            <p>{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <button className="mt-3 text-red-500" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstaPost;
