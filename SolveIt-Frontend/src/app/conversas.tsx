import { Button, ButtonText } from "@/components/button";
import React from "react";
import { Text, View } from "react-native";

export default function Conversas() {
  return (
    <View className="flex-1 bg-gray-950">
      <Text className="text-white">
        {/* exemplo de botao da biblioteca atomlab */}
        <Button>
          <ButtonText>Conversas</ButtonText>
        </Button>
      </Text>
    </View>
  );
}