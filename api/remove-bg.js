import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Vérifie que la méthode est bien POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image manquante' });
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVEBG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBase64,
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: 'Erreur Remove.bg', details: errorText });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
