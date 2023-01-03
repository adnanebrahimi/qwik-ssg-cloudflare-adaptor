// @ts-ignore
// import GhostContentAPI from '@tryghost/content-api'
import {IGhostPostsResponse} from "~/models/ghost-posts.model";


const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const timeout = <T,>(
  promise: Promise<T>,
  ms: number,
  error?: Error
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(error);
    }, ms);
  });
  return Promise.race<T>([promise, timeout]);
};

const retry = <T,>(
  fn: () => Promise<T>,
  retries: number,
  retryDelay: number
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    return fn()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          console.warn(
            `Request Failed, Retrying (${retries})${
              reason ? ": " + (reason.code ?? reason) : ""
            }...`
          );
          return wait(retryDelay)
            .then(retry.bind(null, fn, retries - 1, retryDelay))
            .then(resolve as any)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export type GhostLimitType = "all" | number;
const fetchGhost = <T,>(
  req: string,
  options?: {
    limit?: GhostLimitType;
    orderKey?: string;
    order?: "DESC" | "ASC";
    filter?: { [p: string]: string };
    includes?: string;
  }
): Promise<T> => {
  const RETRY_TIMES = 3;
  const RETRY_DELAY = 250;
  const TIMEOUT = 20000;

  const requestParams = `${options?.limit ? `&limit=${options.limit}` : ""}${
    options?.orderKey
      ? `&order=${options.orderKey} ${options.order ?? "DESC"}`
      : ""
  }${
    options?.filter
      ? "&filter=" +
      Object.entries(options.filter)
        .map(([key, value]) => `${key}:${value}`)
        .join("+")
      : ""
  }${options?.includes ? `&include=${options.includes}` : ""}`;
  console.log(`GET /${req} ${requestParams.replace(/&/g, '  ')}`);
  const fetchFn = () =>
    timeout(
      fetch(
        `${import.meta.env.VITE_GHOST_URL}/ghost/api/content/${req}/?key=${
          import.meta.env.VITE_GHOST_KEY
        }${requestParams}`,
        {
          headers: {
            "Accept-Version": import.meta.env.VITE_GHOST_VERSION,
          },
        }
      ),
      TIMEOUT,
      new Error("Request timeout.")
    );

  return retry(fetchFn, RETRY_TIMES, RETRY_DELAY)
    .then((res) =>
      res
        .json()
        .then((json) => json)
        .catch((err) => console.error("Response Stream To Object Error", err))
    )
    .catch((err) => console.error("Request Error", err));
};

export const GhostClientService = {
  getPostBySlug: (slug: string) => {
    return fetchGhost<IGhostPostsResponse>(`posts/slug/${slug}`, {
      includes: "tags,authors",
    });
  },
  getPosts: (tag?: string, limit?: GhostLimitType) => {
    return fetchGhost<IGhostPostsResponse>("posts", {
      includes: "tags",
      filter: tag ? { primary_tag: tag } : undefined,
      limit: limit
    });
  }
};

export const useGhostClient = () => {
  return GhostClientService;
};
