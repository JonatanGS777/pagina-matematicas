// /api/role.js
import { kv } from '@vercel/kv';

function getUIDFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener conteos de cada rol
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes'),
        kv.scard('role:set:maestros'),
        kv.scard('role:set:padres'),
        kv.scard('role:set:otros'),
      ]);

      // Verificar si este UID ya votó
      const uid = getUIDFromCookie(req);
      const voted = uid ? await kv.sismember('role:set:voted', uid) : false;

      return res.json({
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0,
        voted: voted
      });
    } catch (error) {
      return res.status(500).json({ error: 'Database error' });
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
      const alreadyVoted = await kv.sismember('role:set:voted', uid);
      if (alreadyVoted) {
        return res.status(409).json({ error: 'ALREADY_VOTED' });
      }

      // Registrar voto
      await kv.sadd('role:set:voted', uid);
      await kv.sadd(`role:set:${role}`, uid);

      // Devolver conteos actualizados
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes'),
        kv.scard('role:set:maestros'),
        kv.scard('role:set:padres'),
        kv.scard('role:set:otros'),
      ]);

      return res.json({
        ok: true,
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0
      });
    } catch (error) {
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // Para resetear durante desarrollo (eliminar después)
  if (req.method === 'DELETE') {
    try {
      await Promise.all([
        kv.del('role:set:voted'),
        kv.del('role:set:estudiantes'),
        kv.del('role:set:maestros'),
        kv.del('role:set:padres'),
        kv.del('role:set:otros'),
      ]);
      return res.json({ ok: true, reset: true });
    } catch (error) {
      return res.status(500).json({ error: 'Reset failed' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}