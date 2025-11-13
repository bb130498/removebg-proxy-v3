export default async function handler(req, res) {
  const formData = new FormData();

  // Récupère l'image envoyée au proxy
  const file = req.body;

  formData.append("image_file", file, "image.png");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVEBG_API_KEY,
    },
    body: formData,
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}

