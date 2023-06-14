
import React, { useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';
import { TopBar } from '../components';
import { AddQuizForm } from '../forms';

const AddQuizActivity = (props) => {

  const { fetchAddQuiz, navigation } = props.route.params;

  useEffect(() => {
    const backToStartActivity = () => {
      Alert.alert('Uwaga !', 'Czy na pewno chcesz wrócić do ekranu startowego? Niezapisane dane przepadną.', [
        { text: 'Anuluj', onPress: () => null, style: 'cancel' },
        { text: 'Tak', onPress: () => navigation.popToTop() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backToStartActivity,);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TopBar
        applicationName={'QuizApp'}
      />
      <View style={styles.mainContent}>
        <AddQuizForm
          fetchAddQuiz={fetchAddQuiz}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 8,
    backgroundColor: 'white',
    paddingTop: 10,
  },
});

export default AddQuizActivity;
