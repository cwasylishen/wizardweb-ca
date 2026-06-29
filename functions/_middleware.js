// Default Spanish browsers to /cr/ (the Costa Rica page). English visitors and
// anyone who clicks "EN" (?en=1, remembered via a cookie) keep the main site.
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // English opt-out: remember the choice in a cookie.
  if (url.searchParams.get("en") === "1") {
    const res = await next();
    const r = new Response(res.body, res);
    r.headers.append("Set-Cookie", "wlang=en; Path=/; Max-Age=31536000; SameSite=Lax");
    return r;
  }

  if (url.pathname === "/" && request.method === "GET") {
    const al = (request.headers.get("accept-language") || "").toLowerCase();
    const isEs = al.split(",")[0].trim().startsWith("es");
    const optedEn = /(?:^|;\s*)wlang=en/.test(request.headers.get("cookie") || "");
    if (isEs && !optedEn) return Response.redirect(url.origin + "/cr/", 302);
  }
  return next();
}
