
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import React from 'react';

const QuizAttemptItem = (props) => {

  const { quizAttempt, fetchDeleteQuizAttemptById, navigation } = props;

  return (
    <View style={styles.quizAttempt}>
      <View style={styles.infoGroup2}>
        <Text style={styles.textInfo}>Podejście: </Text>
        <Text style={styles.textInfo2}>{quizAttempt.attemptNumber}</Text>
      </View>
      <View style={styles.infoGroup}>
        <Text style={styles.textInfo}>Data podejścia: </Text>
        <Text style={styles.textInfo2}>{quizAttempt.attemptDate}</Text>
      </View>
      <View style={styles.infoGroup2}>
        <Text style={styles.textInfo}>Zdobyte punkty: </Text>
        <View style={styles.infoGroup3}>
          <Text style={styles.textInfo}>{quizAttempt.earnedScore}/</Text>
          <Text style={styles.textInfo3}>{quizAttempt.maxPoints} pkt</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <CustomButton
          text={'Wyświetl pełne podejście'}
          onPress={() =>
            navigation.navigate('QuizAttemptActivity', {
              quizAttempt: quizAttempt,
              navigation: navigation,
            })
          }
          styleButton={styles.buttonShowQuizAttempt}
          styleButtonText={styles.buttonShowQuizAttemptText}
        />
        <CustomButton
          text={'Usuń wpis'}
          onPress={async () => {
            await fetchDeleteQuizAttemptById( quizAttempt.id );
          }}
          styleButton={styles.buttonDeleteQuizAttempt}
          styleButtonText={styles.buttonDeleteQuizAttemptText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quizAttempt: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'ghostwhite',
    borderRadius: 10,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  quizText: {
    paddingLeft: 20,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonDeleteQuizAttempt: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'orangered',
    width: 100,
    height: 50,
  },
  buttonDeleteQuizAttemptText: {
    color: 'white',
    fontSize: 14,
  },
  buttonShowQuizAttempt: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'dodgerblue',
    width: 160,
    height: 50,
  },
  buttonShowQuizAttemptText: {
    color: 'white',
    fontSize: 14,
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '100%',
  },
  infoGroup2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  infoGroup3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textInfo: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'dimgrey',
  },
  textInfo2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  textInfo3: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default QuizAttemptItem;
