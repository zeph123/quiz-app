
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import CustomButton from './CustomButton';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const QuizItem = (props) => {

  const {quiz, fetchDeleteQuizById, fetchGetAllQuizzes, navigation} = props;

  const [expand, setExpand] = useState(false);
  const uniqueId = uuidv4();

  return (
    <TouchableOpacity key={ uniqueId } onPress={() => setExpand(!expand)}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={[styles.quiz, { height: expand ? 200 : 100} ]}>
        <Text style={styles.quizText}>{ quiz.name }</Text>
        {expand &&
          <>
            <View style={styles.btnGroup}>
              <CustomButton
                text={'Edytuj'}
                onPress={() =>
                  navigation.navigate('EditQuizActivity', {
                    quizId: quiz.id,
                    navigation: navigation,
                    fetchGetAllQuizzes: fetchGetAllQuizzes,
                  })
                }
                styleButton={styles.buttonEditQuiz}
                styleButtonText={styles.buttonEditQuizText}
              />
              <CustomButton
                text={'Usuń'}
                onPress={async () => {
                  await fetchDeleteQuizById(quiz.id);
                }}
                styleButton={styles.buttonDeleteQuiz}
                styleButtonText={styles.buttonDeleteQuizText}
              />
            </View>
            <View style={styles.btnGroup}>
              <CustomButton
                text={'Rozwiąż'}
                onPress={() =>
                  navigation.navigate('SolveQuizActivity', {
                  quizId: quiz.id,
                  navigation: navigation,
                  })
                }
                styleButton={styles.buttonSolveQuiz}
                styleButtonText={styles.buttonSolveQuizText}
              />
              <CustomButton
                text={'Wyświetl historię'}
                onPress={() =>
                  navigation.navigate('QuizAttemptsHistoryActivity', {
                    quizId: quiz.id,
                    navigation: navigation,
                  })
                }
                styleButton={styles.buttonShowHistoryQuiz}
                styleButtonText={styles.buttonShowHistoryQuizText}
              />
            </View>
          </>
        }
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quiz: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'snow',
  },
  quizText: {
    paddingLeft: 20,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  btnGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  buttonEditQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'dodgerblue',
    width: 120,
    height: 40,
  },
  buttonEditQuizText: {
    color: 'white',
    fontSize: 12,
  },
  buttonDeleteQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'orangered',
    width: 120,
    height: 40,
  },
  buttonDeleteQuizText: {
    color: 'white',
    fontSize: 12,
  },
  buttonSolveQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'limegreen',
    width: 120,
    height: 40,
  },
  buttonSolveQuizText: {
    color: 'white',
    fontSize: 12,
  },
  buttonShowHistoryQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'whitesmoke',
    width: 120,
    height: 40,
  },
  buttonShowHistoryQuizText: {
    color: 'black',
    fontSize: 12,
  },
});

export default QuizItem;
