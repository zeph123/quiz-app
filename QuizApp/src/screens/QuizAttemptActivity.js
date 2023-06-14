
import React, { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  checkIfQuestionIsTextType,
} from '../functions/others';

const QuizAttemptActivity = (props) => {

  const { quizAttempt, navigation } = props.route.params;

  useEffect(() => {

    const backToPreviousActivity = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backToPreviousActivity);
    return () => backHandler.remove();
  }, [navigation]);

  function getOnlyAnswersId( question, givenAnswers )  {
    let data = [];
    givenAnswers.forEach((givenAnswer) => {
      if (question.id === givenAnswer.questionId) {
        data.push(givenAnswer.answerId);
      }
    });
    return data;
  }

  function getAnswersByQuestion( question, givenAnswers )  {
    let data = [];
    givenAnswers.forEach((givenAnswer) => {
      if (question.id === givenAnswer.questionId) {
        data.push(givenAnswer);
      }
    });
    return data;
  }

  function getOnlyCorrectAnswersId( question )  {
    let data = [];
    question.answers.forEach((answer) => {
      if (answer.isCorrect === true) {
        data.push(answer.id);
      }
    });
    return data;
  }

  function getCorrectAnswersByQuestion( question ) {
    let data = [];
    question.answers.forEach((answer) => {
      if (answer.isCorrect === true) {
        data.push(answer);
      }
    });
    return data;
  }

  function getOnlyTextAnswer( question, givenAnswers ) {
    let data = '';
    givenAnswers.forEach((givenAnswer) => {
      if (question.id === givenAnswer.questionId) {
        data = givenAnswer.textAnswer;
      }
    });
    return data;
  }

  function setSelectedAnswers( question, answer, givenAnswers ) {
    if (!checkIfQuestionIsTextType(question)) {
      const givenAnswersId = getOnlyAnswersId(question, givenAnswers);
      if (givenAnswersId.includes(answer.id)) {
        return true;
      }
    }

    return false;
  }

  function checkIfAnswerIsCorrect( question, answer, givenAnswers ) {
    if (!checkIfQuestionIsTextType(question)) {
      if (setSelectedAnswers(question,answer,givenAnswers) && answer.isCorrect) {
        return true;
      }
    } else {
      const givenTextAnswer = getOnlyTextAnswer(question, givenAnswers);
      if (givenTextAnswer === answer.name) {
        return true;
      }
    }
    return false;
  }

  function checkAllAnswersCorrectness( question, givenAnswers ) {
    if (!checkIfQuestionIsTextType(question)) {
      let correctCount = 0;
      const correctAnswersId = getOnlyCorrectAnswersId(question);
      const givenAnswersToQuestion = getAnswersByQuestion(question, givenAnswers);
      for (const givenAnswer of givenAnswersToQuestion) {
        if (!correctAnswersId.includes(givenAnswer.answerId)) {
          return false;
        } else {
          correctCount++;
        }
      }
      if (correctCount !== correctAnswersId.length) {
        return false;
      }
    } else {
      const correctAnswers = getCorrectAnswersByQuestion(question);
      const givenTextAnswer = getOnlyTextAnswer(question, givenAnswers);
      if (givenTextAnswer !== correctAnswers[0].name) {
        return false;
      }
    }
    return true;
  }

  function calculatePointsToQuestion( question, givenAnswers ) {
    if (checkAllAnswersCorrectness(question, givenAnswers)) {
      return 1;
    }
    return 0;
  }

  return (
    <View style={styles.container}>
      <TopBar
        applicationName={'QuizApp'}
      />
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.containerScrollView}>

          <View style={styles.containerQuizAttempt}>
            <View style={styles.infoGroup2}>
              <Text style={styles.textInfo2}>Quiz: </Text>
              <Text style={styles.textInfo}>"{quizAttempt.quiz.name}"</Text>
            </View>
            <View style={styles.infoGroup2}>
              <Text style={styles.textInfo2}>Podejście: </Text>
              <Text style={styles.textInfo}>{quizAttempt.attemptNumber}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.textInfo2}>Data podejścia: </Text>
              <Text style={styles.textInfo}>{quizAttempt.attemptDate}</Text>
            </View>
            <View style={styles.infoGroup2}>
              <Text style={styles.textInfo2}>Zdobyte punkty: </Text>
              <View style={styles.infoGroup3}>
                <Text style={styles.textInfo}>{quizAttempt.earnedScore}/</Text>
                <Text style={styles.textInfo3}>{quizAttempt.maxPoints} pkt</Text>
              </View>
            </View>
          </View>

          <View style={styles.containerGivenAnswers}>

            <Text style={styles.containerGivenAnswersTitle}>Udzielone odpowiedzi:</Text>

            <View>
              { quizAttempt.quiz.questions.map((question, questionIndex) => {
                let correctAnswers = getCorrectAnswersByQuestion(question);
                return (
                  <View
                    key={questionIndex}
                    style={[
                      styles.containerQuestion,
                      // eslint-disable-next-line react-native/no-inline-styles
                      { backgroundColor: checkAllAnswersCorrectness( question, quizAttempt.givenAnswers ) ? 'white' : 'rgba(255, 25, 50, 0.4)' },
                    ]}
                  >

                    <View
                      style={[
                        styles.questionView,
                        // eslint-disable-next-line react-native/no-inline-styles
                        { backgroundColor: checkAllAnswersCorrectness( question, quizAttempt.givenAnswers ) ? 'white' : 'rgba(255, 25, 50, 0.7)' },
                      ]}
                    >
                      <View style={styles.containerQuestionPoints}>
                        <Text style={styles.questionEarnedPointsText}>{ calculatePointsToQuestion( question, quizAttempt.givenAnswers ) }/</Text>
                        <Text style={styles.questionMaxPointsText}>1 pkt</Text>
                      </View>
                      <Text style={styles.questionNameText}>{question.name}</Text>
                    </View>
                    { question.answers.map((answer, answerIndex) => {
                      return (
                        <View
                          key={answerIndex}
                          style={[
                          styles.answerView,
                          { backgroundColor:
                            !checkIfQuestionIsTextType(question) ?
                              (
                              setSelectedAnswers(question, answer, quizAttempt.givenAnswers) ?
                                (
                                  checkIfAnswerIsCorrect(question, answer, quizAttempt.givenAnswers) ?
                                    'rgba(0, 255, 100, 0.7)' : 'rgba(255, 25, 50, 0.7)'
                                )
                                :
                                'white'
                              ) :
                              (
                                checkIfAnswerIsCorrect(question, answer, quizAttempt.givenAnswers) ?
                                  'rgba(0, 255, 100, 0.7)' : 'rgba(255, 25, 50, 0.7)'
                              ),
                          },
                          ]}
                        >
                          { !checkIfQuestionIsTextType(question) ?
                              (
                                <Text style={styles.answerNameText}>{answer.name}</Text>
                              ) :
                              (
                                <Text style={styles.answerNameText}>{getOnlyTextAnswer(question, quizAttempt.givenAnswers)}</Text>
                              )
                          }
                          {
                            !checkIfQuestionIsTextType(question) ?
                              (
                                setSelectedAnswers(question, answer, quizAttempt.givenAnswers) &&
                                (
                                  checkIfAnswerIsCorrect(question, answer, quizAttempt.givenAnswers) ?
                                    (
                                      <Icon name="check" size={16} color="black" style={styles.answerIcon} />
                                    )
                                    :
                                    (
                                      <Icon name="close" size={16} color="black" style={styles.answerIcon} />
                                    )
                                )
                              ) :
                              (
                                checkIfAnswerIsCorrect(question, answer, quizAttempt.givenAnswers) ?
                                  (
                                    <Icon name="check" size={16} color="black" style={styles.answerIcon} />
                                  )
                                  :
                                  (
                                    <Icon name="close" size={16} color="black" style={styles.answerIcon} />
                                  )
                              )
                          }
                        </View>
                      );
                    })}

                    { !checkAllAnswersCorrectness( question, quizAttempt.givenAnswers ) &&
                        <View style={styles.correctAnswersView}>
                          <Text style={styles.correctAnswersTitleText}>Poprawne odpowiedzi:</Text>
                          { correctAnswers.map((answer, index) => {
                            return (
                              <Text style={styles.correctAnswersText}>{index + 1}. {answer.name}</Text>
                            );
                          })}
                        </View>
                    }

                  </View>
                );
              })}
            </View>

          </View>
        </ScrollView>
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
  containerScrollView: {
    marginHorizontal: 10,
    flexGrow: 1,
  },
  containerQuizAttempt: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'ghostwhite',
  },
  containerGivenAnswers: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'ghostwhite',
  },
  containerGivenAnswersTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 20,
    color: 'dimgrey',
  },
  containerQuestion: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  questionView: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  answerView: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  answerIcon: {
    marginLeft: 'auto',
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
  answerNameText: {
    fontSize: 16,
    color: 'black',
  },
  questionNameText: {
    fontSize: 16,
    paddingTop: 5,
    color: 'black',
  },
  containerQuestionPoints: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  questionEarnedPointsText: {
    fontSize: 16,
    color: 'dimgrey',
  },
  questionMaxPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  correctAnswersView: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  correctAnswersTitleText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  correctAnswersText: {
    fontSize: 16,
    color: 'black',
  },
});

export default QuizAttemptActivity;
