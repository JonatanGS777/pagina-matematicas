// Devuelve solo el código de país (ISO 3166-1, dos letras) que Vercel
// ya calcula en su red. La IP no sale de Vercel ni se guarda.
module.exports = (req, res) => {
    const raw = String(req.headers['x-vercel-ip-country'] || '').toUpperCase();
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ country: /^[A-Z]{2}$/.test(raw) ? raw : null }));
};
