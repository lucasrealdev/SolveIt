import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

const Loader = ({ isLoading }) => {
  const { width, height } = Dimensions.get("window");
  const osName = Platform.OS;

  if (!isLoading) return null;

  return (
    <View
      style={{
        position: "absolute",
        width,
        height,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#000"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
