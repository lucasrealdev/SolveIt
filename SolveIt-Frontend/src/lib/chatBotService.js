import { useState } from "react";

const API_URL = 'https://api.x.ai/v1/chat/completions'; // Substitua pela URL correta da API

const ChatbotService = () => {
  const [response, setResponse] = useState('');

  const sendMessageToChatbot = async (userMessage) => {
    try {

      console.log("Mensagem do usuário enviada:", userMessage);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Especificando que o corpo da requisição é em JSON
          'Authorization': 'Bearer xai-TBMmIfhJqifwqdePcpsmoF1UWEfq5KoX8fCoFbMUtCXfHsSicR7ctHmQOS75xVspR3NKXGBrpp9uqFSP', // Usando a chave de autenticação
        },
        body: JSON.stringify(       // Aqui ocorre a transformação da mensagem em JSON
          {
            messages: [  // O campo "messages" é um array que inclui o contexto e a mensagem do usuário
              { role: "system", content: "Como você pode me ajudar?" },  // Contexto do sistema
              { role: "user", content: userMessage }, // A mensagem do usuário que foi recebida no front-end
            ],
            model: "grok-beta",  // Modelo do chatbot
            stream: false,  // Não usar streaming
            temperature: 0,  // Respostas mais diretas e objetivas
          }),
      });

      if (!res.ok) {
        console.error('Erro na resposta:', {
          status: res.status,
          statusText: res.statusText,
        });
        throw new Error('Erro ao se comunicar com o chatbot');
      }

      const data = await res.json(); // A resposta do chatbot é convertida de volta de JSON

      // Logando a resposta recebida da API
      console.log("Resposta recebida da API:", data);

      setResponse(data.choices[0].message.content); // Aqui você pega o conteúdo da resposta e exibe na tela
    } catch (error) {
      console.error('Erro:', error);
      setResponse('Houve um problema ao se comunicar com o chatbot.');
    }
  };

  return { response, sendMessageToChatbot };
};

export default ChatbotService;
