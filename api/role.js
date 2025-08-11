// api/role.js  (CommonJS)
const { kv } = require('@vercel/kv');

// Parseo robusto del body (no depende del Content-Type)
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
      const [e,m,p,o] = await Promise.all([
        kv.get('role:estudiantes'),
        kv.get('role:maestros'),
        kv.get('role:padres'),
        kv.get('role:otros'),
      ]);
      return res.status(200).json({
        estudiantes: Number(e || 0),
        maestros:    Number(m || 0),
        padres:      Number(p || 0),
        otros:       Number(o || 0),
      });
    }

    if (req.method === 'POST') {
      const { role } = await readJSON(req);
      const valid = ['estudiantes','maestros','padres','otros'];
      if (!valid.includes(role)) {
        return res.status(400).json({ error: 'role inválido' });
      }

      const value = await kv.incr(`role:${role}`); // contador simple
      return res.status(200).json({ ok: true, role, value });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('ROLE_API_ERROR:', err);
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
};
