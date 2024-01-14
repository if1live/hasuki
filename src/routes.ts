import { BooleanParam, QueryParamConfig, StringParam } from "use-query-params";

// react-router 안쓰고 query string 손대는 편법
// https://github.com/pbeshai/use-query-params/issues/237#issuecomment-1825975483
export const myQueryParams = {
  list: StringParam,
  v: StringParam,
  player: StringParam,
  flag: StringParam,
  note: StringParam,
  autoplay: BooleanParam,
} as const;

type X<T> = {
  -readonly [K in keyof T]?: T[K] extends QueryParamConfig<infer A, infer B>
    ? NonNullable<A>
    : never;
};

export type MyQueryParams = X<typeof myQueryParams>;

export type RedirectFn = (q: MyQueryParams) => void;
