// api/role.js - Usando REST API directa de Upstash

function getUIDFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)site_uid=([^;]+)/);
  return match ? match[1] : null;
}

// Función para hacer llamadas directas a Upstash REST API
async function upstashRequest(command) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  console.log('Using URL:', url ? 'URL_EXISTS' : 'URL_MISSING');
  console.log('Using Token:', token ? 'TOKEN_EXISTS' : 'TOKEN_MISSING');
  
  if (!url || !token) {
    throw new Error(`Missing Upstash credentials. URL: ${!!url}, Token: ${!!token}`);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upstash API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.result;
}

export default async function handler(req, res) {
  // Debugging de variables
  console.log('=== ENV VARS DEBUG ===');
  console.log('KV_REST_API_URL exists:', !!process.env.KV_REST_API_URL);
  console.log('KV_REST_API_TOKEN exists:', !!process.env.KV_REST_API_TOKEN);
  console.log('UPSTASH_REDIS_REST_URL exists:', !!process.env.UPSTASH_REDIS_REST_URL);
  console.log('UPSTASH_REDIS_REST_TOKEN exists:', !!process.env.UPSTASH_REDIS_REST_TOKEN);
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
      console.log('Getting role counts...');

      // Obtener conteos usando REST API directa
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        upstashRequest(['SCARD', 'role:set:estudiantes']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:maestros']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:padres']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:otros']).catch(() => 0)
      ]);

      // Verificar si este UID ya votó
      const uid = getUIDFromCookie(req);
      const voted = uid ? await upstashRequest(['SISMEMBER', 'role:set:voted', uid]).catch(() => 0) : 0;

      const response = {
        estudiantes: estudiantes || 0,
        maestros: maestros || 0,
        padres: padres || 0,
        otros: otros || 0,
        voted: Boolean(voted)
      };

      console.log('Response:', response);
      return res.json(response);
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message,
        env_debug: {
          kv_url_exists: !!process.env.KV_REST_API_URL,
          kv_token_exists: !!process.env.KV_REST_API_TOKEN,
          upstash_url_exists: !!process.env.UPSTASH_REDIS_REST_URL,
          upstash_token_exists: !!process.env.UPSTASH_REDIS_REST_TOKEN
        }
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
      const alreadyVoted = await upstashRequest(['SISMEMBER', 'role:set:voted', uid]).catch(() => 0);
      
      if (alreadyVoted) {
        return res.status(409).json({ error: 'ALREADY_VOTED' });
      }

      // Registrar voto
      await upstashRequest(['SADD', 'role:set:voted', uid]);
      await upstashRequest(['SADD', `role:set:${role}`, uid]);

      console.log(`Vote registered successfully for ${role}`);

      // Devolver conteos actualizados
      const [estudiantes, maestros, padres, otros] = await Promise.all([
        upstashRequest(['SCARD', 'role:set:estudiantes']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:maestros']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:padres']).catch(() => 0),
        upstashRequest(['SCARD', 'role:set:otros']).catch(() => 0)
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
        details: error.message
      });
    }
  }

  // Método DELETE para resetear (opcional)
  if (req.method === 'DELETE') {
    try {
      await Promise.all([
        upstashRequest(['DEL', 'role:set:voted']).catch(() => {}),
        upstashRequest(['DEL', 'role:set:estudiantes']).catch(() => {}),
        upstashRequest(['DEL', 'role:set:maestros']).catch(() => {}),
        upstashRequest(['DEL', 'role:set:padres']).catch(() => {}),
        upstashRequest(['DEL', 'role:set:otros']).catch(() => {})
      ]);
      return res.json({ ok: true, reset: true });
    } catch (error) {
      console.error('DELETE Error:', error);
      return res.status(500).json({ error: 'Reset failed', details: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}