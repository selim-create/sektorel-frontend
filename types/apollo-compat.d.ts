/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TypedDocumentNode } from "@apollo/client";

type SektorelGraphQLData = Record<string, any>;
type SektorelGraphQLVariables = Record<string, any>;

declare module "@apollo/client" {
  export function gql(
    literals: TemplateStringsArray,
    ...placeholders: unknown[]
  ): TypedDocumentNode<SektorelGraphQLData, SektorelGraphQLVariables>;
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
