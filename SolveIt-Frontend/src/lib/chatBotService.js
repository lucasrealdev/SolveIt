// ChatbotService.js
// Serviço de integração com a Gemini API

const ChatbotService = () => {
  // Sua chave da API do Gemini (deve ser obtida no Google AI Studio)
  // https://ai.google.dev/
  const API_KEY = 'AIzaSyAxcmA6eS39NlNpt5gP86L5e_6UEfz3AWM';
  
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  const sendMessageToChatbot = async (userMessage) => {
    try {
      // Construindo a URL completa com a chave da API
      const urlWithKey = `${API_URL}?key=${API_KEY}`;
      
      const res = await fetch(urlWithKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Não é necessário cabeçalho Authorization com a Gemini API
          // A autenticação é feita via parâmetro de query 'key'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });
  
      if (!res.ok) {
        console.error('Erro na resposta:', {
          status: res.status,
          statusText: res.statusText,
        });
        throw new Error('Erro ao se comunicar com o chatbot');
      }
  
      const data = await res.json();
      
      // Extraindo a resposta do formato da Gemini API
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Formato de resposta inesperado');
      }
    } catch (error) {
      console.error('Erro:', error);
      return 'Houve um problema ao se comunicar com o chatbot.';
    }
  };
  
  return { sendMessageToChatbot };
};

export default ChatbotService;