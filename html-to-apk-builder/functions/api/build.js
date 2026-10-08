export async function onRequestPost(context) {
  const TOKEN = context.env.TOKEN;
  const REPO = context.env.REPO;

  if (!TOKEN || !REPO) {
    return new Response(JSON.stringify({ error: 'TOKEN/REPO belum di set di Cloudflare' }), { status: 500 });
  }

  const { html, name } = await context.request.json();
  const b64 = btoa(unescape(encodeURIComponent(html)));

  const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'build_apk',
      client_payload: { html: b64, name: name || 'DATA-HK' }
    })
  });

  return new Response(JSON.stringify({ ok: res.ok, status: res.status }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
