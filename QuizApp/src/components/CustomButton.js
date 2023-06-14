
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const CustomButton = (props) => {
  return (
    <TouchableOpacity onPress={ props.onPress }>
      <View style={[props.styleButton, styles.button ]}>
        <Text style={[props.styleButtonText, styles.buttonText ]}>{ props.text }</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default CustomButton;
