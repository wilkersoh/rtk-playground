import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "/api", // default it is /api
    baseQuery: baseQuery,
    tagTypes: ["Posts"],
    endpoints: (builder) => ({}),
});
