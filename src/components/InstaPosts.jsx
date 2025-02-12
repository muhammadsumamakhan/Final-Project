import React, { useState, useEffect } from "react";
import { FaRegHeart, FaRegComment, FaRegShareSquare, FaRegBookmark } from "react-icons/fa";
import { db } from "../config/firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const InstaPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState({});

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
                };
            });

            setPosts(fetchedPosts);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Handle like button click
    const handleLike = (postId) => {
        setLikes((prev) => ({
            ...prev,
            [postId]: prev[postId] ? prev[postId] + 1 : 1,
        }));
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
                posts.map((post) => (
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
                                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
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
                            {/* Like Button */}
                            <button
                                className="text-2xl flex items-center space-x-1 hover:opacity-80 cursor-pointer"
                            >
                                <FaRegHeart />
                            </button>

                            {/* Comment Icon */}
                            <button className="text-2xl hover:opacity-80 cursor-pointer">
                                <FaRegComment />
                            </button>

                            {/* Share Icon */}
                            <button className="text-2xl hover:opacity-80 cursor-pointer">
                                <FaRegShareSquare />
                            </button>

                            {/* Bookmark Icon */}
                            <button className="text-2xl hover:opacity-80 cursor-pointer">
                                <FaRegBookmark />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default InstaPost;
