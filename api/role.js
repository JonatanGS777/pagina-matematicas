// api/role.js
import { kv } from '@vercel/kv';

function getUIDFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  // DEBUGGING: Log environment variables
  console.log('=== DEBUG ENV VARS ===');
  console.log('KV_URL exists:', !!process.env.KV_URL);
  console.log('KV_REST_API_URL exists:', !!process.env.KV_REST_API_URL);
  console.log('KV_REST_API_TOKEN exists:', !!process.env.KV_REST_API_TOKEN);
  console.log('KV_URL value starts with:', process.env.KV_URL?.substring(0, 20));
  console.log('KV_REST_API_URL starts with:', process.env.KV_REST_API_URL?.substring(0, 20));
  console.log('=====================');

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Test basic KV connection first
      console.log('Testing KV connection...');
      
      // Obtener conteos de cada rol
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes').catch(err => {
          console.error('Error getting estudiantes count:', err);
          return 0;
        }),
        kv.scard('role:set:maestros').catch(err => {
          console.error('Error getting maestros count:', err);
          return 0;
        }),
        kv.scard('role:set:padres').catch(err => {
          console.error('Error getting padres count:', err);
          return 0;
        }),
        kv.scard('role:set:otros').catch(err => {
          console.error('Error getting otros count:', err);
          return 0;
        }),
      ]);

      console.log('KV operations completed successfully');

      // Verificar si este UID ya votó
      const uid = getUIDFromCookie(req);
      const voted = uid ? await kv.sismember('role:set:voted', uid).catch(err => {
        console.error('Error checking voted status:', err);
        return false;
      }) : false;

      const response = {
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0,
        voted: Boolean(voted)
      };

      console.log('Sending response:', response);
      return res.json(response);
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message,
        stack: error.stack?.substring(0, 500)
      });
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

      console.log(`Processing vote for role: ${role}, UID: ${uid}`);

      // Verificar si ya votó
      const alreadyVoted = await kv.sismember('role:set:voted', uid).catch(err => {
        console.error('Error checking if already voted:', err);
        return false;
      });
      
      if (alreadyVoted) {
        return res.status(409).json({ error: 'ALREADY_VOTED' });
      }

      // Registrar voto
      await kv.sadd('role:set:voted', uid);
      await kv.sadd(`role:set:${role}`, uid);

      console.log(`Vote registered successfully for ${role}`);

      // Devolver conteos actualizados
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        kv.scard('role:set:estudiantes').catch(() => 0),
        kv.scard('role:set:maestros').catch(() => 0),
        kv.scard('role:set:padres').catch(() => 0),
        kv.scard('role:set:otros').catch(() => 0),
      ]);

      const response = {
        ok: true,
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0
      };

      console.log('Vote response:', response);
      return res.json(response);
    } catch (error) {
      console.error('POST Error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message,
        stack: error.stack?.substring(0, 500)
      });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}