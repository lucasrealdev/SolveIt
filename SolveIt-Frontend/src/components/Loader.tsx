import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

const Loader = ({ isLoading }) => {
  const osName = Platform.OS;

  if (!isLoading) return null;

  return (
    <View className="w-full h-svh items-center justify-center">
      <ActivityIndicator
        animating={isLoading}
        color="#000"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;