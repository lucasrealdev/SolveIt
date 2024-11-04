import React, { createContext, useContext, useState } from 'react';
import { Text, Animated, StyleSheet, View, Pressable } from 'react-native';

interface AlertButton {
  text: string;            // Texto do botão
  onPress: () => void;    // Função a ser chamada ao pressionar o botão
}

interface AlertContextProps {
  showAlert: (title: string, message: string, buttons?: AlertButton[], duration?: number) => void;
  hideAlert: () => void;
  isVisible: boolean;
  alertTitle: string;
  alertMessage: string;
  alertButtons?: AlertButton[];
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);
  const slideAnim = useState(new Animated.Value(100))[0];

  const showAlert = (title: string, message: string, buttons: AlertButton[] = [], duration: number = 3000) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setAlertVisible(true);
    
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setAlertVisible(false));
    }, duration);
  };
  
  const hideAlert = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setAlertVisible(false));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, isVisible: alertVisible, alertTitle, alertMessage, alertButtons }}>
      {children}
      {alertVisible && (
        <Animated.View style={[styles.alertContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.alertTitle}>{alertTitle}</Text>
          <Text style={styles.alertMessage}>{alertMessage}</Text>
          {alertButtons.length > 0 && (
            <View style={styles.buttonContainer}>
              {alertButtons.map((button, index) => (
                <Pressable key={index} onPress={() => {
                  button.onPress();
                  hideAlert(); // Oculta o alerta após o botão ser pressionado
                }} style={styles.button}>
                  <Text style={styles.buttonText}>{button.text}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 5,
    margin: 10,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  alertMessage: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
