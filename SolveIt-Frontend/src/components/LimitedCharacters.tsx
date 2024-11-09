import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import CustomIcons from '@/assets/icons/CustomIcons';

const CharacterLimitedTextInput: React.FC = () => {
  const maxLength = 325;
  const [inputText, setInputText] = useState<string>('');

  const handleTextChange = (text: string) => {
    setInputText(text);
  };

  return (
    <View
      accessibilityLabel="ViewWithTextInput"
      className="p-[6px] rounded-[20px] w-[520px] h-[144px] justify-start border-[1px] border-[#3692C5] text-wrap gap-[10px]"
    >
      <TextInput
        placeholder="Hi there! I'm X-AE-A-19, an AI enthusiast and fitness aficionado. When I'm not crunching numbers or optimizing algorithms, you can find me hitting the gym."
        className="h-[100px] outline-none text-[#94A3B8] text-[16px]"
        textAlignVertical="top"
        numberOfLines={10}
        maxLength={maxLength}
        multiline
        value={inputText}
        onChangeText={handleTextChange}
      />
      <View accessibilityLabel="BottomPart" className="flex flex-row justify-between w-[98%]">
        <Text className="text-[12px] text-[#94A3B8]">
          {maxLength - inputText.length} characters remaining
        </Text>
        <CustomIcons name="iconeAddPost" size={16} />
      </View>
    </View>
  );
};

export default CharacterLimitedTextInput;
