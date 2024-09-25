import MenuRight from "@/components/MenuRight";
import { Button, ButtonText } from "@/components/button";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 flex-row bg-white">
      <View className="flex-1">
        <Text className="text-white">
          {/* exemplo de botao da biblioteca atomlab */}
          <Button>
            <ButtonText>Index</ButtonText>
          </Button>
        </Text>
      </View>
      <MenuRight/>
    </View>
  );
}