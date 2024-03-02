import {SymbolKind} from "vscode-languageserver-types";

interface FetchPostsOrPostParams {
    isOverview: boolean;
    postSlug?: string | null;
    perPage?: number | null;
    username: string;
}

export const fetchPostsOrPost =
    async ({
               isOverview,
               postSlug = null,
               perPage = null,
               username
           }: FetchPostsOrPostParams) => {
        const {userAgent} = useDevice();
        // const $blog = useRuntimeConfig().public.blog;
        if (isOverview) {
            // Fetch all posts for the blog overview
            let url = `https://dev.to/api/articles?username=${username}`;

            if (perPage) {
                url += `&per_page=${perPage}`
            }
            return $fetch(url, {
                headers: {
                    'User-Agent': userAgent
                }
            })
        }
        return $fetch(`https://dev.to/api/articles/${username}/${postSlug}`, {
            headers: {
                'User-Agent': userAgent
            }
        })
    };

const formatDateTime = (timestamp, humanReadable = false) => {
    try {
        const dateObj = new Date(timestamp);

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date");
        }

        if (humanReadable) {
            // Format the date in a human-readable form
            const options = {year: 'numeric', month: 'long', day: 'numeric'};
            return dateObj.toLocaleDateString('en-US', options);
        }

        // Extracting the date in YYYY-MM-DD format
        const date = dateObj.toISOString().split('T')[0];

        // Extracting the year
        const year = dateObj.getFullYear();

        return {date, year};
    } catch (error) {
        // console.error("Error parsing timestamp:", error.message);
        // Return null or some default value to indicate failure
        return {date: null, year: null};
    }
}

export const transformDevToPostLists = (data, humanReadableDateTime = false) => {
    if (Array.isArray(data)) {
        return data.map((post) => {
            return {
                ...post,
                slug: post.path.split('/').pop(),
                publishedDateTime: formatDateTime(post.published_timestamp, humanReadableDateTime)
            }
        })
    }
    return data;
}
