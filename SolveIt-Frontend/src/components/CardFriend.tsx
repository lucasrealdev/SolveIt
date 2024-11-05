import CustomIcons from '@/assets/icons/CustomIcons';
import { View, Image, Text } from 'react-native';
import images from '@/constants/images';
import HoverColorComponent from './HoverColorComponent'; // Certifique-se de importar o HoverColorComponent
import colors from '@/constants/colors';

interface CardFriendProps {
  label: string;
}

const CardFriend: React.FC<CardFriendProps> = ({ label }) => {
  const isFollower = label === "seguidores";
  const isFriendOrMenu = label === "amigo" || label === "menu";
  // Definindo as cores de hover e press dependendo do tipo de label
  const colorHover = isFriendOrMenu ? colors.textSecondary.standard : "#D21F3C"; // Cor de hover dependendo de ser amigo/menu ou seguidor
  const colorPressIn = isFriendOrMenu ? colors.primaryStandardDark.standard : "#c20826"; // Cor de press dependendo de ser amigo/menu ou seguidor

  return (
    <View
      accessibilityLabel="Amigo"
      className={`flex flex-row border-b border-borderStandardLight py-4 ${label !== 'menu' ? 'px-[15px]' : ''} gap-3 items-center`}
    >
      <Image className="w-[40px] h-[40px] rounded-full" source={images.person} />
      <View className="flex-1 gap-[1px]">
        <Text className="text-textSecondary font-bold text-[14px]">Júlia Smith</Text>
        <Text className="text-textSecondary font-medium text-[14px]">@juliasmith</Text>
      </View>
      
      {/* Substituindo a lógica de hover com HoverColorComponent */}
      <HoverColorComponent
        colorHover={colorHover} // Usando a cor de hover definida
        colorPressIn={colorPressIn} // Usando a cor de press definida
      >
        {isFollower ? (
          <Text className="text-[14px] font-bold" style={{ color: '#FF0029' }}>
            Remover
          </Text>
        ) : isFriendOrMenu ? (
          <CustomIcons
            name="mais" // Substitua pelo nome do ícone que você deseja usar
            color="#94A3B8" // A cor do ícone muda com o hover
            size={20}
          />
        ) : null}
      </HoverColorComponent>
    </View>
  );
};

export default CardFriend;
