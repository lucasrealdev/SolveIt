import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
    return (
      <View className="tela-add-problemas">
        
        <Content />
        
      </View>
    );
  }

  function Content() { 
    return (
        <div className="flex flex-col space-x-6 justify-center items-center h-screen rounded border-black">
          <h1 className="mb-16 font-bold text-3xl text-center border-green-600">
            Primeiro teste da tela
          </h1>
        </div>
    );
  }