
import { FieldArray } from 'formik';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { CustomButton } from './index';
import React from 'react';
import { checkIfQuestionIsTextType, checkTypeOfQuestion, disableSwitch } from '../functions/others';
import { validateAnswerName, getValidationResultOfAnswerName, validateArrayOfAnswers, getValidationResultOfArrayOfAnswers } from '../functions/validation';

const Answers = ({name, question, questionIndex, values, errors, handleChange, setFieldValue}) => {

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <View style={styles.fieldArray}>
          {question.answers.map((answer, answerIndex) => (
            <View key={answerIndex} style={styles.inputAnswer}>

              <Text style={styles.sectionTitle}>Odpowiedź nr {answerIndex + 1}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nazwa</Text>
                <TextInput
                  name={`${name}[${answerIndex}].name`}
                  value={values.questions[questionIndex].answers[answerIndex].name}
                  onChangeText={handleChange(`${name}[${answerIndex}].name`)}
                  style={styles.inputText}
                />
                { getValidationResultOfAnswerName(values.questions[questionIndex].answers[answerIndex].name) &&
                  <Text style={styles.errorText}> {validateAnswerName(values.questions[questionIndex].answers[answerIndex].name)} </Text>
                }
              </View>

              <View style={styles.inputGroupSwitch}>
                <Text style={styles.inputLabel}>Czy poprawna?</Text>
                <Switch
                  trackColor={{false: 'rgb(120, 120, 120)', true: 'rgb(80, 170, 255)'}}
                  thumbColor={values.questions[questionIndex].answers[answerIndex].isCorrect ? 'rgb(195, 240, 255)' : 'rgb(245, 245, 251)'}
                  ios_backgroundColor={'#3e3e3e'}
                  name={`${name}[${answerIndex}].isCorrect`}
                  value={values.questions[questionIndex].answers[answerIndex].isCorrect}
                  onValueChange={(itemValue) => {
                    setFieldValue(`${name}[${answerIndex}].isCorrect`, itemValue);
                  }}
                  disabled={disableSwitch( question, answerIndex )}
                />
              </View>

              <CustomButton
                text={'Usuń odpowiedź'}
                onPress={() => arrayHelpers.remove(answerIndex)}
                styleButton={styles.buttonDeleteAnswer}
                styleButtonText={styles.buttonDeleteAnswerText}
              />

            </View>
          ))}

          { getValidationResultOfArrayOfAnswers(values.questions[questionIndex].answers) &&
            <Text style={styles.errorText}> {validateArrayOfAnswers(values.questions[questionIndex].answers)} </Text>
          }

          { checkIfQuestionIsTextType(question) !== true &&
            <CustomButton
              text={'Dodaj odpowiedź'}
              onPress={() => {
                arrayHelpers.push(checkTypeOfQuestion(question, questionIndex));
              }}
              styleButton={styles.buttonAddAnswer}
              styleButtonText={styles.buttonAddAnswerText}
            />
          }

          { checkIfQuestionIsTextType(question) && question.answers.length < 1 &&
            <CustomButton
              text={'Dodaj odpowiedź'}
              onPress={() => {
                arrayHelpers.push(checkTypeOfQuestion(question, questionIndex));
              }}
              styleButton={styles.buttonAddAnswer}
              styleButtonText={styles.buttonAddAnswerText}
            />
          }

        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  fieldArray: {
    width: '100%',
  },
  inputAnswer: {
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
  inputGroupSwitch: {
    marginVertical: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buttonAddAnswer: {
    marginTop: 20,
    marginVertical: 10,
    backgroundColor: 'rgb(0, 160, 0)',
    width: 150,
    height: 40,
  },
  buttonAddAnswerText: {
    color: 'white',
    fontSize: 16,
  },
  buttonDeleteAnswer: {
    marginTop: 20,
    marginVertical: 10,
    backgroundColor: 'rgb(200, 25, 0)',
    width: 150,
    height: 40,
  },
  buttonDeleteAnswerText: {
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

export default Answers;
