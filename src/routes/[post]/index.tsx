import { component$, Resource } from "@builder.io/qwik";
import {
  StaticGenerateHandler,
  useEndpoint,
  useLocation,
} from "@builder.io/qwik-city";
import { useGhostClient } from "~/hooks/useGhostClient";
import { IGhostPost } from "~/models/ghost-posts.model";
import { ExtendedEndpoint, onGetExtended } from "~/providers/onGetExtended";

interface PostEndpoint extends ExtendedEndpoint {
  post: IGhostPost;
}

export const onGet = onGetExtended<PostEndpoint>(async (req) => {
  const api = useGhostClient();
  const postResponse = await api.getPostBySlug(req.params.post);
  const post = postResponse?.posts?.length > 0 ? postResponse.posts[0] : null;
  if (!post) {
    throw req.response.redirect("/404");
  }
  return {
    post,
  };
});

export default component$(() => {
  const { params } = useLocation();
  console.log("Params:", params);
  const endpoint = useEndpoint<typeof onGet>();

  return (
    <>
      <h1>Result:</h1>
      <div>param: {params.post}</div>
      <Resource
        value={endpoint}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={(data) => (
          <>
            <div dangerouslySetInnerHTML={data.post.html || ""}></div>
          </>
        )}
      />
    </>
  );
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const api = useGhostClient();
  const posts = await api.getPosts(undefined, "all");

  return {
    params: posts.posts.map((post) => ({ post: post.slug })),
  };
};
