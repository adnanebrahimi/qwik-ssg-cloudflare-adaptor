import { component$ } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { useGhostClient } from "~/hooks/useGhostClient";
import { IGhostPostsResponse } from "~/models/ghost-posts.model";
import { ExtendedEndpoint, onGetExtended } from "~/providers/onGetExtended";

interface PageEndpoint extends ExtendedEndpoint {
  posts: IGhostPostsResponse;
}

export const onGet = onGetExtended<PageEndpoint>(async () => {
  const api = useGhostClient();
  const posts = await api.getPosts();
  return {
    posts,
  };
});

export default component$(() => {
  const endpoint = useEndpoint<typeof onGet>();

  const posts = endpoint.value.then((v) =>
    v.posts.posts.map((post) => <p><a href={'/' + post.slug}>{post.title}</a></p>)
  );

  return <>{posts}</>;
});
