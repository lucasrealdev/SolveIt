const API_URL = 'https://api.x.ai/v1/chat/completions'; // Substitua pela URL correta da API

const ChatbotService = () => {
  const sendMessageToChatbot = async (userMessage) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xai-TBMmIfhJqifwqdePcpsmoF1UWEfq5KoX8fCoFbMUtCXfHsSicR7ctHmQOS75xVspR3NKXGBrpp9uqFSP',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Como você pode me ajudar?" },
            { role: "user", content: userMessage },
          ],
          model: "grok-beta",
          stream: false,
          temperature: 0,
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
      return data.choices[0].message.content; // Retorna a resposta diretamente
    } catch (error) {
      console.error('Erro:', error);
      return 'Houve um problema ao se comunicar com o chatbot.';
    }
  };  

  return { sendMessageToChatbot };
};

export default ChatbotService;
