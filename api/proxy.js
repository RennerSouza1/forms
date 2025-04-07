export default async function handler(req, res) {
    // Verifica se é uma requisição POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    try {
      const { action, endpoint, formData, sender, token } = req.body;
      
      if (!action || !endpoint) {
        return res.status(400).json({ error: 'Parâmetros ausentes' });
      }
  
      const API_URL = 'https://api.ezchatbot.ai';
      let url;
  
      // Monta a URL conforme a ação
      switch(action) {
        case 'run':
          url = `${API_URL}/run/${endpoint}?sender=${sender}&token=${token}`;
          break;
        // Adicione outros casos se necessário
        default:
          return res.status(400).json({ error: 'Ação inválida' });
      }
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Configura os headers CORS
      res.setHeader('Access-Control-Allow-Origin', 'https://forms-ten-ivory.vercel.app');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      return res.status(200).json(data);
    } catch (error) {
      console.error('Erro no proxy:', error);
      return res.status(500).json({ 
        error: 'Erro no servidor',
        details: error.message 
      });
    }
  }
  
  export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1mb'
      }
    }
  };