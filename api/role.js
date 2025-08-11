// api/role.js
import { kv } from '@vercel/kv';

function getUIDFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  // Agregar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Obtener conteos de cada rol
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes').catch(() => 0),
        kv.scard('role:set:maestros').catch(() => 0),
        kv.scard('role:set:padres').catch(() => 0),
        kv.scard('role:set:otros').catch(() => 0),
      ]);

      // Verificar si este UID ya votó
      const uid = getUIDFromCookie(req);
      const voted = uid ? await kv.sismember('role:set:voted', uid).catch(() => false) : false;

      return res.json({
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0,
        voted: Boolean(voted)
      });
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const uid = getUIDFromCookie(req);
      if (!uid) {
        return res.status(400).json({ error: 'NO_UID' });
      }

      const { role } = req.body;
      const validRoles = ['estudiantes', 'maestros', 'padres', 'otros'];
      
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'INVALID_ROLE' });
      }

      // Verificar si ya votó
      const alreadyVoted = await kv.sismember('role:set:voted', uid).catch(() => false);
      if (alreadyVoted) {
        return res.status(409).json({ error: 'ALREADY_VOTED' });
      }

      // Registrar voto
      await kv.sadd('role:set:voted', uid);
      await kv.sadd(`role:set:${role}`, uid);

      // Devolver conteos actualizados
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes').catch(() => 0),
        kv.scard('role:set:maestros').catch(() => 0),
        kv.scard('role:set:padres').catch(() => 0),
        kv.scard('role:set:otros').catch(() => 0),
      ]);

      return res.json({
        ok: true,
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0
      });
    } catch (error) {
      console.error('POST Error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
  }

  // Para resetear durante desarrollo (opcional - puedes eliminar después)
  if (req.method === 'DELETE') {
    try {
      await Promise.all([
        kv.del('role:set:voted').catch(() => {}),
        kv.del('role:set:estudiantes').catch(() => {}),
        kv.del('role:set:maestros').catch(() => {}),
        kv.del('role:set:padres').catch(() => {}),
        kv.del('role:set:otros').catch(() => {}),
      ]);
      return res.json({ ok: true, reset: true });
    } catch (error) {
      console.error('DELETE Error:', error);
      return res.status(500).json({ error: 'Reset failed', details: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}