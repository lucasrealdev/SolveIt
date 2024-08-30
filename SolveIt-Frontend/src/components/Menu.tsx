import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { icons } from "@/assets/icons";

export default function Menu({ state, descriptors, navigation }) {
  const primaryColor = "#01B198";
  const greyColor = "#737373";

  return (
    <View className="w-full flex absolute bottom-0 items-center bg-gray-950 pb-3">
      <View className="w-full flex relative flex-row justify-between items-center px-[30px]
      py-[8px] rounded-[20px] bg-[#444444] max-w-[400px] left-1/2r">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          if(['_sitemap', '+not-found'].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.name}
              style={styles.MenuItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {
                icons[route.name]({
                  color: isFocused? primaryColor : greyColor,
                })
              }
              <Text style={{
                color: isFocused ? primaryColor : greyColor, 
                fontSize: 11
              }}>
              {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MenuItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4
  }
})