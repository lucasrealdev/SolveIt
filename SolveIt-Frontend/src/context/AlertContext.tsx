import React, { createContext, useContext, useState } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

interface AlertContextProps {
  showAlert: (title: string, message: string, duration?: number) => void; // Adicione a prop duration
  hideAlert: () => void; // Função para esconder o alerta
  isVisible: boolean; // Estado de visibilidade
  alertTitle: string; // Título do alerta
  alertMessage: string; // Mensagem do alerta
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const slideAnim = useState(new Animated.Value(100))[0];

  const showAlert = (title: string, message: string, duration: number = 3000) => { // Use 3000 como padrão
    setAlertTitle(title);
    setAlertMessage(message);
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
    }, duration); // Use a prop duration aqui
  };
  
  const hideAlert = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setAlertVisible(false));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, isVisible: alertVisible, alertTitle, alertMessage }}>
      {children}
      {alertVisible && (
        <Animated.View style={[styles.alertContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.alertTitle}>{alertTitle}</Text>
          <Text style={styles.alertMessage}>{alertMessage}</Text>
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
});
