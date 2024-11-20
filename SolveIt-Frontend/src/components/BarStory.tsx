import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import ButtonScale from "@/components/ButtonScale";
import CustomIcons from "@/assets/icons/CustomIcons";
import images from "@/constants/images";

interface User {
  name: string;
  image?: string; // Optional image prop if you want to allow custom images
}

interface BarStoryProps {
  users?: User[]; // Make users optional with a default value
  onNextPress?: () => void; // Optional callback for next button
}

const BarStory: React.FC<BarStoryProps> = ({ 
  users = [
    { name: "x_ae-23b" },
    { name: "maisenpai" },
  ],
  onNextPress = () => console.log("Pressionou") 
}) => {
  return (
    <View 
      aria-label="ContainerStory" 
      className="flex p-[20px] gap-[16px] bg-white rounded-[24px] shadow-[0px_12px_16px_-4px_rgba(16,_24,_40,_0.09)] flex-row items-center border border-borderStandardLight"
    >
      {users.map((user, index) => (
        <ButtonScale 
          key={index} 
          scale={1.05} 
          className="flex justify-center items-center w-fit"
        >
          <LinearGradient
            aria-label="ContainerImage"
            colors={['#4F46E5', '#C622FF', '#FF2222', '#FFA439']}
            style={styles.containerImage}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          >
            <Image 
              source={user.image || images.person} 
              className="border-white border-[2px] rounded-full w-[64px] h-[64px]" 
            />
          </LinearGradient>
          <Text className="text-textStandardDark font-semibold">{user.name}</Text>
        </ButtonScale>
      ))}
      
      <ButtonScale
        scale={1.1}
        onPress={onNextPress}
        className="w-8 h-8 rounded-full bg-white border border-borderStandardLight flex items-center absolute justify-center right-3"
      >
        <CustomIcons name="proximo" color="#475569" size={20} />
      </ButtonScale>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 9999, // full rounded
  },
});

export default BarStory;