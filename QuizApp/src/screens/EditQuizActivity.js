
import { Alert, BackHandler, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { TopBar } from '../components';
import { EditQuizForm } from '../forms';

const EditQuizActivity = (props) => {

  const { quizId, navigation, fetchGetAllQuizzes } = props.route.params;

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
        <EditQuizForm
          quizId={quizId}
          navigation={navigation}
          fetchGetAllQuizzes={fetchGetAllQuizzes}
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

export default EditQuizActivity;
