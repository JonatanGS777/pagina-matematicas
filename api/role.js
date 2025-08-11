// api/role.js (CommonJS)
const { kv } = require('@vercel/kv');

// Extrae UID desde cookie "site_uid" (opcional para evitar votos dobles)
function getUIDFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

// Parseo robusto del body (soporta errores de Content-Type)
async function readJSON(req) {
  return await new Promise((resolve) => {
    let buf = '';
    req.on('data', c => (buf += c));
    req.on('end', () => {
      try { resolve(buf ? JSON.parse(buf) : {}); } catch { resolve({}); }
    });
  });
}

module.exports = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      const uid = getUIDFromCookie(req);
      const [e, m, p, o] = await Promise.all([
        kv.scard('role:set:estudiantes'),
        kv.scard('role:set:maestros'),
        kv.scard('role:set:padres'),
        kv.scard('role:set:otros'),
      ]);
      const voted = uid ? !!(await kv.sismember('role:set:voted', uid)) : false;

      return res.status(200).end(JSON.stringify({
        estudiantes: Number(e || 0),
        maestros:    Number(m || 0),
        padres:      Number(p || 0),
        otros:       Number(o || 0),
        voted
      }));
    }

    if (req.method === 'POST') {
      const { role } = await readJSON(req);
      const valid = ['estudiantes', 'maestros', 'padres', 'otros'];
      if (!valid.includes(role)) {
        return res.status(400).end(JSON.stringify({ error: 'role inválido' }));
      }

      const uid = getUIDFromCookie(req);
      if (uid) {
        const already = await kv.sismember('role:set:voted', uid);
        if (already) {
          return res.status(200).end(JSON.stringify({ error: 'ALREADY_VOTED' }));
        }
        await kv.sadd('role:set:voted', uid);
        await kv.sadd(`role:set:${role}`, uid);
      } else {
        // Si no hay UID, añade un marcador único para contar (sin deduplicar)
        await kv.sadd(`role:set:${role}`, `anon:${Date.now()}:${Math.random().toString(36).slice(2)}`);
      }

      const [e, m, p, o] = await Promise.all([
        kv.scard('role:set:estudiantes'),
        kv.scard('role:set:maestros'),
        kv.scard('role:set:padres'),
        kv.scard('role:set:otros'),
      ]);

      return res.status(200).end(JSON.stringify({
        ok: true, role,
        estudiantes: Number(e || 0),
        maestros:    Number(m || 0),
        padres:      Number(p || 0),
        otros:       Number(o || 0),
      }));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (err) {
    console.error('ROLE_API_ERROR:', err);
    return res.status(500).end(JSON.stringify({ error: 'server_error', message: err.message }));
  }
};
