import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const Help = () => {
  const CardProblem = ({ icon, title, description }) => (
    <View
      className="bg-white rounded-xl p-4 mb-4 w-full"
      style={{
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.15, // Opacidade da sombra
        shadowRadius: 3.5, // Raio da sombra
        elevation: 5, // Elevation para Android (necessário para sombra no Android)
      }}
    >
      <View className="flex-row items-start w-full">
        <Ionicons name={icon} size={24} color="#0174b2" className="mt-0.5" />
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-800 mb-1">{title}</Text>
          <Text className="text-sm text-gray-600 leading-5">{description}</Text>
        </View>
      </View>
    </View>
  );

  const handlePress = () => {
    // A URL que você quer abrir. Pode ser um link do WhatsApp ou qualquer outra URL
    const whatsappURL = 'https://wa.me/5519988705090';  // Substitua pelo seu número de WhatsApp ou outro link
    Linking.openURL(whatsappURL).catch(err => console.error("Erro ao tentar abrir o link: ", err));
  };

  return (
    <View className='flex-1 items-center bg-white'>
      <View className="flex-1 max-w-[1900px] bg-white">
        <StatusBar style="auto" />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="p-5 items-center rounded-b-xl" style={{ backgroundColor: 'rgba(1, 114, 177, 0.05)' }}>
            <Text className="text-3xl font-bold text-gray-900 mb-5 text-center">
              Nossa História
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-4 leading-7">
              O SolveIt nasceu de um grupo de quatro amigos com uma ideia simples: criar algo que realmente ajudasse as pessoas no seu dia a dia.
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-4 leading-7">
              Queríamos desenvolver algo impactante, mas, no início, nos deparamos com uma pergunta fundamental:
            </Text>
            <Text className="text-xl font-semibold text-accentStandardDark text-center my-4">
              como podemos ajudar se não sabemos exatamente o que as pessoas precisam?
            </Text>
            <Text className="text-lg text-gray-600 text-center leading-7">
              Foi então que percebemos algo essencial. Toda grande invenção tem um ponto em comum: ela surge para resolver uma necessidade. Só que as necessidades nem sempre são óbvias.
            </Text>
          </View>

          {/* Problems Section */}
          <View className="p-5 bg-white w-full">
            <Text className="text-2xl font-bold text-gray-900 mb-5 text-center">
              Exemplos
            </Text>

            <CardProblem
              icon="car-outline"
              title="O tempo perdido no trânsito"
              description="Imagine poder aproveitar o tempo de deslocamento para conhecer seus vizinhos ou até mesmo compartilhar caronas, economizando dinheiro e contribuindo para o meio ambiente."
            />

            <CardProblem
              icon="school-outline"
              title="A correria do dia a dia escolar"
              description="E se existisse um espaço onde pais, alunos e professores pudessem se comunicar facilmente, evitando desencontros e garantindo mais organização no dia a dia?"
            />

            <CardProblem
              icon="construct-outline"
              title="A busca por profissionais confiáveis"
              description="Já pensou em um lugar onde você pudesse encontrar rapidamente aquele encanador ou eletricista de confiança, indicado por pessoas próximas a você?"
            />

            <CardProblem
              icon="wallet-outline"
              title="Gerenciamento de despesas familiares"
              description="Como seria poder controlar e dividir as despesas domésticas de forma simples e prática, aliviando o estresse das finanças em grupo?"
            />
          </View>

          <View className="p-5"></View>

          <View className="p-5 mx-3 bg-primaryStandardDark rounded-xl">
            <Text className="text-2xl font-bold text-white mb-4 text-center">
              Por Que Compartilhar Seu Problema?
            </Text>
            <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 24 }}>
              Estudos de psicologia mostram que falar sobre seus problemas, mesmo de forma anônima, pode
              reduzir o estresse, melhorar a saúde mental e auxiliar na resolução de questões pessoais.
            </Text>
            <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 24, marginTop: 16 }}>
              Um exemplo é uma pesquisa publicada no portal
              <Text
                style={{ color: '#63B3ED', fontWeight: 'bold' }}
                onPress={() => Linking.openURL('https://www.otempo.com.br/saude-e-bem-estar/2024/11/25/desabafar-com-chatbots-faz-voce-se-sentir-melhor--diz-pesquisa?utm_source=chatgpt.com')}
              >
                {' O Tempo '}
              </Text>
              que revela como desabafar, até mesmo com chatbots, proporciona alívio emocional significativo.
            </Text>
            <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 24, marginTop: 16 }}>
              Além disso, o portal
              <Text
                style={{ color: '#63B3ED', fontWeight: 'bold' }}
                onPress={() => Linking.openURL('https://universoracionalista.org/desabafar-e-benefico-para-a-saude-mental/?utm_source=chatgpt.com')}
              >
                {' Universo Racionalista '}
              </Text>
              explora como escrever sobre sentimentos, como em diários, ajuda a curar experiências traumáticas e a melhorar a consciência emocional.
            </Text>
            <Text className="text-base text-white opacity-90 leading-6 my-4">
              O SolveIt é o lugar ideal para isso. Você pode usar nossa plataforma para desabafar sobre qualquer coisa, desde pequenas frustrações até situações mais sérias. O mais importante: você está em um ambiente seguro e acolhedor.
            </Text>
            <Text className="text-base text-white opacity-90 leading-6">
              E sabe o que é interessante? Ao compartilhar, você pode acabar inspirando soluções que ajudam não só você, mas muitas outras pessoas. Um simples desabafo pode virar o início de algo incrível.
            </Text>

            <Text className="text-base text-white opacity-90 leading-6 my-4">
              Imagine se Steve Jobs tivesse ignorado a dificuldade das pessoas em usar computadores na época. Ele percebeu que a tecnologia parecia algo complicado e inacessível para o público geral. Foi desse incômodo que nasceu o iPhone, que mudou como nos conectamos, trabalhamos e até nos divertimos.
            </Text>
            <Text className="text-base text-white opacity-90 leading-6 my-4">
              Agora pense em algo mais próximo: o incômodo de ficar na chuva tentando pegar um táxi que nunca chega. Foi essa frustração que inspirou a criação do Uber, resolvendo não só a dificuldade de encontrar transporte, mas também de se locomover de forma mais prática e acessível.
            </Text>

            <Text className="text-2xl font-bold text-white mb-4 text-center">
              Seja Parte da Mudança
            </Text>
            <Text className="text-base text-white opacity-90 leading-6">
              No SolveIt, acreditamos que até as menores frustrações podem se tornar inovações que fazem diferença no dia a dia. Um cano quebrado no meio da noite, dificuldade para organizar as tarefas escolares do seu filho, ou até mesmo o desafio de encontrar um serviço confiável perto de casa – tudo isso pode ser o ponto de partida para algo revolucionário.
            </Text>
            <Text className="text-base text-white opacity-90 leading-6 mt-4">
              Compartilhar o que te incomoda não é só um desabafo, é um ato de colaboração. Ao dividir seu problema, você abre portas para que outras pessoas, com a mesma dificuldade, encontrem uma solução.
            </Text>
            <Text className="text-base text-white opacity-90 leading-6 mt-4">
              Para empreendedores, nossa plataforma é um espaço cheio de oportunidades. Mas para quem só quer desabafar, é um lugar de acolhimento, diversão e alívio. Porque aqui, cada voz importa.
            </Text>
            <TouchableOpacity
              className="bg-white py-3 px-6 rounded-xl items-center mt-6 active:opacity-90"
              onPress={handlePress}
            >
              <View className='flex-row gap-2'>
                <Text className="text-primaryStandardDark text-base font-semibold">
                  Fale Conosco
                </Text>
                <FontAwesome name="whatsapp" size={24} color="#0174b2" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Final Section */}
          <View className="p-5 items-center bg-white">
            <MaterialCommunityIcons name="brain" size={48} color="#3b82f6" />
            <Text className="text-xl text-gray-800 text-center mt-4 font-medium leading-7">
              {"A necessidade é a mãe da invenção\nPlatão"}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Help;