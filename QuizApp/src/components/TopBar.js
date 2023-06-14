
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const TopBar = (props) => {
  return (
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{props.applicationName}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flex: 1,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  topBarText: {
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default TopBar;
