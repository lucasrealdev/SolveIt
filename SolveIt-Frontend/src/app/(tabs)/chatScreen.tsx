import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import ChatbotService from "@/lib/chatBotService" // Caminho do arquivo correto

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const { response, sendMessageToChatbot } = ChatbotService();

  async function handleSend() {
    try {
      const response = await sendMessageToChatbot(message);
      console.log(response);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }
  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Digite sua mensagem"
        value={message}
        onChangeText={setMessage}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Enviar" onPress={handleSend} />
      {/* Exibe a resposta do chatbot */}
      <View>
      <Text className='p-[20px]'>{response}</Text>
      </View>
    </View>
  );
};

export default ChatScreen;
