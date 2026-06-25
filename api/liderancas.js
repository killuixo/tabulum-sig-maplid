export default async function handler(req, res) {
  // A URL real do Google Script fica escondida aqui nas variáveis de ambiente da Vercel
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ error: "Variável GOOGLE_SCRIPT_URL não configurada na Vercel." });
  }

  try {
    if (req.method === 'GET') {
      // Sincronização de leitura (Buscar dados)
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      return res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      // Sincronização de escrita (Salvar/Apagar dados)
      // Como o Apps Script geralmente espera body em texto simples no doPost, passamos como string
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${req.method} não permitido`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao comunicar com o Google Sheets." });
  }
}
