import { useAppDispatch } from "@/app/store";
import React, { useState } from "react";
import {
    useGetPostsQuery,
    useAddPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} from "./postsApiSlice";
import { Post } from "./types";
import Link from "next/link";

interface NewPost extends Pick<Post, "title" | "body"> {}

const PostList = () => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const dispatch = useAppDispatch();
    const initialNewPost = { title: "", body: "" };
    const [newPost, setNewPost] = useState<NewPost>(initialNewPost);
    const { data: posts, isLoading, isError } = useGetPostsQuery();
    const [addPost] = useAddPostMutation();
    const [updatePost] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();
    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const randomId = Math.floor(Math.random() * 1000);

        try {
            addPost({ ...newPost, id: randomId, userId: randomId });
            setNewPost(initialNewPost);
        } catch (error) {
            console.error("error: ", error);
        }
    };

    const handleOnDelete = (id: number) => {
        try {
            deletePost({ id });
        } catch (error) {
            console.error("error: ", error);
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewPost({ ...newPost, [name]: value });
    };

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    const newItemSection = () => {
        return (
            <form onSubmit={handleSubmit}>
                <label htmlFor="new-post">Enter a new post</label>
                <div>
                    <input
                        type="text"
                        id="new-post-title"
                        name="title"
                        value={newPost?.title}
                        onChange={handleOnChange}
                        placeholder="Enter new post title"
                    />
                    <input
                        type="text"
                        id="new-post-body"
                        name="body"
                        value={newPost?.body}
                        onChange={handleOnChange}
                        placeholder="Enter new post body"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };

    const renderPosts = () => {
        if (!posts) return;

        return (
            <section>
                {posts.map((post: Post) => (
                    <article key={post.id}>
                        Id: {post.id}
                        <p>{post.title}</p>
                        <p>{post.body}</p>
                        <button className="edit">
                            <Link href={`/posts/${post.id}`}>Edit</Link>
                        </button>
                        <button className="delete" onClick={() => handleOnDelete(post.id)}>
                            Delete
                        </button>
                    </article>
                ))}
            </section>
        );
    };

    if (isLoading) return <div>is loading</div>;
    if (isError) return <div>something went wrong</div>;

    return (
        <div>
            <h4>Create new post</h4>
            {newItemSection()}
            {renderPosts()}
        </div>
    );
};

export default PostList;
