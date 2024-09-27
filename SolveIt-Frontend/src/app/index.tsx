import MenuRight from "@/components/MenuRight";
import { Button, ButtonText } from "@/components/button";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 flex-row bg-white">
      {/* Primeira View com largura mínima de 720px apenas em telas maiores que 1024px */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Exemplo de botão da biblioteca atomlab */}
        <Button className="h-[110vh]">
          <ButtonText>Index</ButtonText>
        </Button>
      </ScrollView>
      <MenuRight />
    </View>
  );
}
