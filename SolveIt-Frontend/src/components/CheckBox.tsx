import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MyCheckboxComponent() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => setIsChecked(!isChecked)}
    >
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#4F46E5', // Cor do Checkbox quando selecionado
    borderColor: '#4F46E5', // Cor da borda quando selecionado
  },
  checkmark: {
    color: '#fff', // Cor do checkmark
    fontSize: 18,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});