import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";
import { Post } from "./types";

export const postsAdapter = createEntityAdapter<Post>();
export const initialState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<Post[], void>({
            query: () => "/posts",
            transformResponse: (response: Post[]) => {
                return response.sort((a, b) => b.id - a.id);

                // entities transform thru rtk
                // const loadedPosts = response.map((post) => post);
                // return postsAdapter.setAll(initialState, loadedPosts);
            },
            providesTags: ["Posts"],
        }),
        getPostById: builder.query<Post, string | undefined>({
            query: (id) => {
                return `/posts/${id}`;
            },
            providesTags: ["Posts"],
            keepUnusedDataFor: 5,
        }),
        addPost: builder.mutation({
            query: (post) => ({
                url: "/posts",
                method: "POST",
                body: post,
            }),
            invalidatesTags: ["Posts"],
        }),
        updatePost: builder.mutation({
            query: (post) => ({
                url: `/posts/${post.id}`,
                method: "PATCH",
                body: post,
            }),
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Posts"],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useAddPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApiSlice;
