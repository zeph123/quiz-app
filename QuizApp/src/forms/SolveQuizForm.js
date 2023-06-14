
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FieldArray, Formik } from 'formik';
import CustomButton from '../components/CustomButton';
import { URL } from '../constants/requestParams';
import {
  checkIfQuestionIsMultipleChoiceType,
  checkIfQuestionIsSingleChoiceType,
  checkIfQuestionIsTextType,
} from '../functions/others';
import * as Yup from 'yup';
import {
  getValidationResultOfArrayOfAnswersToQuestion,
  getValidationResultOfTextAnswerToQuestion, validateArrayOfAnswersToQuestion,
  validateTextAnswerToQuestion,
} from '../functions/validation';

const validationSchemaFormik = Yup.object().shape({
  answers: Yup.array().of(Yup.object().shape({
    textAnswer: Yup.string().when('$exist', {
      is: exist => exist,
      then: Yup.string().max(255, 'Odpowiedź może zawierać maksymalnie 255 znaków.').required('Udzielenie odpowiedzi jest wymagane.'),
      otherwise: Yup.string(),
      }),
    checkedAnswersId: Yup.array().when('$exist', {
      is: exist => exist,
      then: Yup.array().required('Udzielenie odpowiedzi jest wymagane.'),
      otherwise: Yup.array(),
    }),
  })),
});

const SolveQuizForm = (props) => {

  const {quizId, navigation} = props;
  const [quiz, setQuiz] = useState(null);
  const [loaded, setLoaded] = useState(false);

  function setInitialValues(quiz) {
    let initialData = {
      quizId: quiz.id,
      answers: [],
    };
    if (loaded !== false && quiz.length !== null) {
      quiz.questions.map((question) => {
        if (!checkIfQuestionIsTextType(question)) {
          initialData.answers.push(
            {
              questionId: question.id,
              questionType: question.type,
              checkedAnswersId: [],
              checkedAnswers: [],
            }
          );
        } else {
          initialData.answers.push(
            {
              questionId: question.id,
              questionType: question.type,
              textAnswer: '',
            }
          );
        }
      });
      quiz.questions.map((question, questionIndex) => {
        question.answers.map((answer) => {
          if (!checkIfQuestionIsTextType(question)) {
            initialData.answers[questionIndex].checkedAnswers.push(
              {
                answerId: answer.id,
                checked: false,
              }
            );
          }
        });
      });
    }
    return initialData;
  }

  function updateAnswers(values, question, answerIndex) {
    let oldAnswersId = values;
    if (oldAnswersId.length !== 0) {
      if (checkIfQuestionIsSingleChoiceType(question)) {
        oldAnswersId = [];
        oldAnswersId.push(answerIndex);
      }
      if (checkIfQuestionIsMultipleChoiceType(question)) {
        if (!oldAnswersId.includes(answerIndex)) {
          oldAnswersId.push(answerIndex);
        } else {
          oldAnswersId = oldAnswersId.filter(oldAnswerId => oldAnswerId !== answerIndex);
        }
      }
    } else {
      oldAnswersId.push(answerIndex);
    }
    return oldAnswersId;
  }

  function setAnswersCheckedToDefault(values) {
    for (let answer of values) {
      answer.checked = false;
    }
  }

  const fetchGetQuizById = async ( id ) => {
    const endpoint = `/quizzes/${id}`;
    const httpMethod = 'GET';
    await fetch(URL + endpoint, {
      method: httpMethod,
    })
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        setQuiz(responseData.data);
        setLoaded(true);
      })
      .catch( (error) => {
        console.log(error);
      });
  };

  async function fetchSolveQuizById( id, formData ) {
    const endpoint = `/solveQuiz/${id}`;
    const httpMethod = 'POST';
    const bodyData = JSON.stringify(formData);
    await fetch(URL + endpoint, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
    })
    .then( async (response) => {
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
        throw new Error(`${responseData.message}.`);
      }
      navigation.navigate('CompletedQuizResultActivity', {
        quizId: id,
        navigation: navigation,
      });
      Alert.alert('Sukces',responseData.message);
      setLoaded(false);
      await fetchGetQuizById(id);
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  useEffect( () => {
    fetchGetQuizById(quizId)
    .then( async (response) => {
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
        throw new Error(`${responseData.message}.`);
      }
      setQuiz(responseData.data);
      setLoaded(true);
    })
    .catch( (error) => {
      console.log(error);
    });
  }, [quizId]);

  return (
    <View style={styles.container}>
      {loaded !== false ?
        (
          <ScrollView contentContainerStyle={styles.containerForm}>
            <Formik
              initialValues={setInitialValues(quiz)}
              validationSchema={validationSchemaFormik}
              onSubmit={async (values) => {
                // console.log(JSON.stringify(values));
                await fetchSolveQuizById( values.quizId, values );
              }}
            >
              {({ setFieldValue, handleChange,
                handleSubmit, values, errors }) => (

                <>
                  <Text style={styles.formTitle}>Rozwiązywanie Quizu</Text>

                  <View style={styles.horizontalLine} />

                  <Text style={styles.sectionTitle}> Quiz: "{quiz.name}" </Text>

                  <View style={styles.horizontalLine} />

                  <FieldArray
                    name="questions"
                    render={() => (

                      <View style={styles.fieldArray}>

                        { quiz.questions.map((question, questionIndex) => (

                          <View key={questionIndex} style={styles.questionView}>

                            <Text style={styles.questionName}> {question.name} </Text>

                            <View style={styles.answersView}>

                              { quiz.questions[questionIndex].answers.map((answer, answerIndex) => {

                                if (checkIfQuestionIsTextType(question)) {
                                  return (
                                    <>
                                      <TextInput
                                        key={answerIndex}
                                        value={values.answers[questionIndex].textAnswer}
                                        onChangeText={(itemValue) => {
                                          setFieldValue(`answers[${questionIndex}].textAnswer`, itemValue);
                                        }}
                                        style={styles.inputText}
                                      />
                                      { getValidationResultOfTextAnswerToQuestion(values.answers[questionIndex].textAnswer) &&
                                      <Text style={styles.errorText}> {validateTextAnswerToQuestion(values.answers[questionIndex].textAnswer)} </Text>
                                      }
                                    </>
                                  );
                                }

                                if (checkIfQuestionIsSingleChoiceType(question)) {
                                  return (
                                    <TouchableOpacity
                                      key={answerIndex}
                                      style={styles.answerTouchable}
                                      onPress={ () => {
                                        let oldAnswersId = updateAnswers(values.answers[questionIndex].checkedAnswersId, question, answer.id);
                                        setFieldValue(`answers[${questionIndex}].checkedAnswersId`, oldAnswersId);
                                        setAnswersCheckedToDefault(values.answers[questionIndex].checkedAnswers);
                                        let checked = values.answers[questionIndex].checkedAnswers[answerIndex].checked;
                                        setFieldValue(`answers[${questionIndex}].checkedAnswers[${answerIndex}].checked`, !checked);
                                      }}
                                    >
                                      <View style={[styles.answerView,
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        {
                                          backgroundColor:
                                            values.answers[questionIndex].checkedAnswers[answerIndex].checked ? 'lightskyblue' : 'lightcyan',
                                        },
                                      ]}>
                                        <Text style={styles.answerName}> {answer.name} </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                }

                                if (checkIfQuestionIsMultipleChoiceType(question)) {
                                  return (
                                    <TouchableOpacity
                                      key={answerIndex}
                                      style={styles.answerTouchable}
                                      onPress={ () => {
                                        let oldAnswersId = updateAnswers(values.answers[questionIndex].checkedAnswersId, question, answer.id);
                                        setFieldValue(`answers[${questionIndex}].checkedAnswersId`, oldAnswersId);
                                        let checked = values.answers[questionIndex].checkedAnswers[answerIndex].checked;
                                        setFieldValue(`answers[${questionIndex}].checkedAnswers[${answerIndex}].checked`, !checked);
                                      }}
                                    >
                                      <View style={[styles.answerView,
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        {
                                          backgroundColor:
                                            values.answers[questionIndex].checkedAnswers[answerIndex].checked ? 'lightskyblue' : 'lightcyan',
                                        },
                                      ]}>
                                        <Text style={styles.answerName}> {answer.name} </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                }

                              })
                              }
                            </View>

                            { !checkIfQuestionIsTextType(question) &&
                              getValidationResultOfArrayOfAnswersToQuestion(values.answers[questionIndex].checkedAnswersId) &&
                              <Text style={styles.errorText}> {validateArrayOfAnswersToQuestion(values.answers[questionIndex].checkedAnswersId)} </Text>
                            }

                          </View>
                        ))}

                      </View>
                    )}
                  />

                  <View style={styles.buttonGroup}>
                    <CustomButton
                      text={'Zapisz'}
                      onPress={handleSubmit}
                      styleButton={styles.buttonSubmit}
                      styleButtonText={styles.buttonSubmitText}
                    />
                  </View>
                </>
              )}
            </Formik>
          </ScrollView>
        ) :
        (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size={styles.loadingIndicator.size} color={styles.loadingIndicator.color} />
            <Text style={styles.loadingInfo}> Proszę czekać, trwa ładowanie Quizu. </Text>
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexGrow: 1,
  },
  loadingScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  loadingIndicator: {
    size: 100,
    color: 'rgb(0, 100, 255)',
  },
  loadingInfo: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: 'black',
  },
  containerForm: {
    marginHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  horizontalLine:{
    width: '100%',
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
    marginVertical: 10,
  },
  fieldArray: {
    width: '100%',
  },
  questionView: {
    backgroundColor: 'lightsteelblue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  questionName: {
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  answersView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  answerTouchable: {
    width: '100%',
    marginVertical: 5,
  },
  answerView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  answerName: {
    color: 'black',
    fontSize: 16,
  },
  inputText: {
    backgroundColor: 'white',
    width: '100%',
    height: 40,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonGroup: {
    alignSelf: 'center',
    width: '100%',
  },
  buttonSubmit: {
    marginVertical: 10,
    backgroundColor: 'dodgerblue',
    width: '100%',
    height: 40,
  },
  buttonSubmitText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: 'rgb(200, 25, 0)',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SolveQuizForm;
