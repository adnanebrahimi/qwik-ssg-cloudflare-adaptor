import { component$, Signal, useSignal } from "@builder.io/qwik";

export interface RouteItem {title: string; url: string}

export const RouteItems = component$((props: {
  items: RouteItem[];
  ref?: Signal<Element | undefined>;
  class?: string;
}) => {
  const ref = useSignal<Element>();

  return <div class={`${props.class ?? ''}`} ref={props.ref ?? ref}>
    {props?.items?.map((item) => <a key={item.url} href={item.url}>{item.title}</a>)}
  </div>
})
