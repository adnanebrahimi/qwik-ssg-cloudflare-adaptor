import { RequestEvent } from "@builder.io/qwik-city";
import { RouteItem } from "~/components/route-items/route-items";
import { IGhostPost } from "~/models/ghost-posts.model";

export interface ExtendedEndpoint {
  origin?: string;
  routeItems?: RouteItem[];
  secondaryRouteItems?: RouteItem[];
  latestFeaturedPosts?: IGhostPost[];
}

export const onGetExtended = <T,>(operation: (req: RequestEvent) => T | Promise<T>) => {
  return async (req: RequestEvent): Promise<T> => {
    if (req.url.pathname.includes('.ttf') || req.url.pathname.includes('.json')) return {} as any;
    console.log(req.params, req.url.pathname);
    return {
      ...(await Promise.resolve(operation(req)))
    }
  }
}
