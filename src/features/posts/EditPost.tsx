import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPostByIdQuery, useUpdatePostMutation } from "./postsApiSlice";
import { Post } from "./types";

const EditPost = () => {
    const postParams = useParams();
    const router = useRouter();
    const id = postParams?.id && typeof postParams.id === "string" ? postParams.id : undefined;
    const { data: post, isLoading } = useGetPostByIdQuery(id);
    const [updateUser, { isLoading: updateLoading, isSuccess }] = useUpdatePostMutation();
    const [editPost, setEditPost] = useState<Post>({ userId: 0, id: 0, body: "", title: "" });

    useEffect(() => {
        if (!post) return;

        setEditPost(post);
    }, [post]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await updateUser(editPost);

            router.push("/");
        } catch (error) {
            console.error("error: ", error);
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        const payload = { ...editPost, [event.target.name]: value };
        setEditPost(payload);
    };

    if (isLoading) return <>is loading</>;
    if (!editPost) return <>no exist post</>;

    return (
        <>
            <button onClick={() => router.push("/")}>Back to List</button>
            <form onSubmit={handleSubmit}>
                <div className="edit-post-input">
                    <label>
                        userId: <strong>{editPost.userId}</strong>
                    </label>
                    <input value={editPost.title} name="title" onChange={handleOnChange} />
                    <input value={editPost.body} name="body" onChange={handleOnChange} />
                </div>
                <button>Submit</button>
            </form>
        </>
    );
};

export default EditPost;
