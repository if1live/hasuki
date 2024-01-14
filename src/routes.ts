import { StringParam } from "use-query-params";

// react-router 안쓰고 query string 손대는 편법
// https://github.com/pbeshai/use-query-params/issues/237#issuecomment-1825975483
export const myQueryParams = {
  list: StringParam,
  v: StringParam,
  player: StringParam,
  flag: StringParam,
  note: StringParam,
} as const;

// 당장 쓰는게 문자열밖에 없어서 간단하게 때움
export type MyQueryParams = {
  -readonly [K in keyof typeof myQueryParams]?: string;
};

export type RedirectFn = (q: MyQueryParams) => void;
