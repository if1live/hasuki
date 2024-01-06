import { Context } from "hono";
import { MiddlewareHandler } from "hono/types";

/**
 * livereload용 html/js 끼워넣는건 미들웨어 수준에서 처리하고 싶다.
 * 나머지 로직에서는 livereloader를 신경쓰지 않는다.
 *
 * @link https://github.com/intesso/connect-livereload/blob/master/index.js
 */
export const livereloadMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    if (shouldOverride(c)) {
      await attachLivereload(c);
    }
  };
};

const shouldOverride = (c: Context): boolean => {
  const contentType = c.res.headers.get("content-type");

  if (contentType?.startsWith("text/html") === false) {
    return false;
  }

  return true;
};

/**
 * @link https://www.npmjs.com/package/livereload
 */
const snippet = `<script>
document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
':35729/livereload.js?snipver=1"></' + 'script>')
</script>`;

const attachLivereload = async (c: Context) => {
  const prev = c.res;

  // html은 관대해서 script 태그 대충 붙여도 돌아간다
  const text_prev = await prev.text();
  const text_next = text_prev + snippet;

  const headers_entries = [...prev.headers.entries()].map(([k, v]) => [k, v]);
  const headers = Object.fromEntries(headers_entries);
  c.res = new Response(text_next, {
    headers,
    status: prev.status,
  });
};
