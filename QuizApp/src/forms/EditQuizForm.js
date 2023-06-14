
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FieldArray, Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../components/CustomButton';
import { URL } from '../constants/requestParams';
import {
  getValidationResultOfArrayOfQuestions,
  getValidationResultOfQuestionName,
  getValidationResultOfQuizName, validateArrayOfQuestions, validateQuestionName,
  validateQuizName,
} from '../functions/validation';
import { questionTypes } from '../constants/constParams';
import Answers from '../components/Answers';
import * as Yup from 'yup';

const validationSchemaFormik = Yup.object().shape({
  name: Yup.string()
    .min(5, 'To pole musi zawierać minimalnie 5 znaków.')
    .max(255, 'To pole może zawierać maksymalnie 255 znaków.')
    .required('To pole jest wymagane.'),
  questions: Yup.array().of(Yup.object().shape({
    name: Yup.string()
      .min(5, 'To pole musi zawierać minimalnie 5 znaków.')
      .max(255, 'To pole może zawierać maksymalnie 255 znaków.')
      .required('To pole jest wymagane.'),
    answers: Yup.array().of(Yup.object().shape({
      name: Yup.string()
        .max(255, 'To pole może zawierać maksymalnie 255 znaków.')
        .required('To pole jest wymagane.'),
    }))
      .required('Dodanie odpowiedzi jest wymagane.'),
  }))
    .min(3, 'Musi zostać dodane minimum 3 pytania.')
    .required('Dodanie pytań jest wymagane.'),
});

const EditQuizForm = (props) => {

  const {quizId, navigation, fetchGetAllQuizzes} = props;

  const [quiz, setQuiz] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const initialValuesFormik = {
    id: quiz.id,
    name: quiz.name,
    questions: quiz.questions,
  };

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

  async function fetchUpdateQuizById( id, formData ) {
    const endpoint = `/quizzes/${id}`;
    const httpMethod = 'PUT';
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
        await fetchGetAllQuizzes();
        navigation.popToTop();
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
              initialValues={initialValuesFormik}
              validationSchema={validationSchemaFormik}
              onSubmit={async (values) => {
                // console.log(JSON.stringify(values));
                await fetchUpdateQuizById( values.id, values );
              }}
            >
              {({ setFieldValue, handleChange,
                handleSubmit, values, errors }) => (

                <>
                  <Text style={styles.formTitle}>Edycja Quizu</Text>

                  <View style={styles.horizontalLine} />

                  <Text style={styles.sectionTitle}>Quiz</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nazwa</Text>
                    <TextInput
                      name={'name'}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      style={styles.inputText}
                    />

                    { getValidationResultOfQuizName(values.name) &&
                      <Text style={styles.errorText}> {validateQuizName(values.name)} </Text>
                    }

                  </View>

                  <View style={styles.horizontalLine} />

                  <Text style={styles.sectionTitle}>Pytania i odpowiedzi</Text>

                  <View style={styles.horizontalLine} />

                  <FieldArray
                    name="questions"
                    render={(arrayHelpers) => (
                      <View style={styles.fieldArray}>
                        {values.questions.map((question, questionIndex) => (
                          <View key={questionIndex} style={styles.inputQuestion}>

                            <Text style={styles.sectionTitle}>Pytanie nr {questionIndex + 1}</Text>

                            <View style={styles.inputGroup}>
                              <Text style={styles.inputLabel}>Nazwa</Text>
                              <TextInput
                                name={`questions[${questionIndex}].name`}
                                value={values.questions[questionIndex].name}
                                onChangeText={handleChange(`questions[${questionIndex}].name`)}
                                style={styles.inputText}
                              />
                              { getValidationResultOfQuestionName(values.questions[questionIndex].name) &&
                                <Text style={styles.errorText}> {validateQuestionName(values.questions[questionIndex].name)} </Text>
                              }
                            </View>

                            <View style={styles.inputGroup}>
                              <Text style={styles.inputLabel}>Typ</Text>
                              <View style={styles.inputPickerBox}>
                                <View style={styles.inputPickerBorder}>
                                  <Picker
                                    name={`questions[${questionIndex}].type`}
                                    selectedValue={values.questions[questionIndex].type}
                                    onValueChange={(itemValue) => {
                                      setFieldValue(`questions[${questionIndex}].type`, itemValue);
                                      setFieldValue(`questions.${questionIndex}.answers`, []);
                                    }}
                                    enabled={true}
                                    mode="dropdown"
                                    placeholder={'Wybierz typ pytania'}
                                    style={styles.inputPicker}
                                  >
                                    {questionTypes.map((item) => {
                                      return (
                                        <Picker.Item
                                          key={item.id}
                                          label={item.name}
                                          value={item.id}
                                        />
                                      );
                                    })}
                                  </Picker>
                                </View>
                              </View>
                            </View>

                            <CustomButton
                              text={'Usuń pytanie'}
                              onPress={() => arrayHelpers.remove(questionIndex)}
                              styleButton={styles.buttonDeleteQuestion}
                              styleButtonText={styles.buttonDeleteQuestionText}
                            />

                            <View style={styles.horizontalLine} />

                            <Answers
                              name={`questions.${questionIndex}.answers`}
                              question={question}
                              questionIndex={questionIndex}
                              values={values}
                              errors={errors}
                              handleChange={handleChange}
                              setFieldValue={setFieldValue}
                            />

                            <View style={styles.horizontalLine} />

                          </View>
                        ))}

                        { getValidationResultOfArrayOfQuestions(values.questions) &&
                          <Text style={styles.errorText}> {validateArrayOfQuestions(values.questions)} </Text>
                        }

                        <CustomButton
                          text={'Dodaj pytanie'}
                          onPress={() => {
                            arrayHelpers.push({
                              id: values.questions.length, // questionIndex
                              name: '',
                              type: 1,
                              orderNumber: values.questions.length + 1, // questionIndex + 1
                              answers: [],
                            });
                          }}
                          styleButton={styles.buttonAddQuestion}
                          styleButtonText={styles.buttonAddQuestionText}
                        />

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
  inputQuestion: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  inputGroup: {
    marginVertical: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputLabel: {
    color: 'black',
    fontSize: 16,
  },
  inputText: {
    width: '100%',
    height: 40,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputPickerBox: {
    marginTop: 10,
    width: '100%',
  },
  inputPickerBorder: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputPicker: {
    width: '100%',
    height: 40,
  },
  buttonAddQuestion: {
    marginVertical: 10,
    backgroundColor: 'rgb(0, 160, 0)',
    width: 120,
    height: 40,
  },
  buttonAddQuestionText: {
    color: 'white',
    fontSize: 16,
  },
  buttonDeleteQuestion: {
    marginTop: 20,
    marginVertical: 10,
    backgroundColor: 'rgb(200, 25, 0)',
    width: 120,
    height: 40,
  },
  buttonDeleteQuestionText: {
    color: 'white',
    fontSize: 16,
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

export default EditQuizForm;
