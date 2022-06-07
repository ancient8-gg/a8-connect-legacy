import A8ConnectComponent from "../container";
import { ComponentMeta } from "@storybook/react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "A8Connect",
  component: A8ConnectComponent,
  id: "a8-connect",
} as ComponentMeta<typeof A8Connect>;

export const A8Connect = () => <A8ConnectComponent />;
