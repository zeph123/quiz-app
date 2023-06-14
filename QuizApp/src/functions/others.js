
import { TYPE_QUESTION_TEXT, TYPE_QUESTION_SINGLE_CHOICE, TYPE_QUESTION_MULTIPLE_CHOICE } from '../constants/constParams';

function checkTypeOfQuestion( question, questionIndex ) {
  let predefinedAnswer = {
    id: question.answers.length, // answerIndex
    name: '',
    isCorrect: false,
    orderNumber: question.answers.length + 1, // answerIndex + 1
    questionId: questionIndex,
  };
  if (question.type === TYPE_QUESTION_TEXT) {
    predefinedAnswer.isCorrect = true;
  }
  return predefinedAnswer;
}

function checkIfQuestionIsTextType( question ) {
  return question.type === TYPE_QUESTION_TEXT;
}

function checkIfQuestionIsSingleChoiceType( question ) {
  return question.type === TYPE_QUESTION_SINGLE_CHOICE;
}

function checkIfQuestionIsMultipleChoiceType( question ) {
  return question.type === TYPE_QUESTION_MULTIPLE_CHOICE;
}

function checkIfCorrectAnswerIsSelected( question ) {
  const answers = question.answers;
  let counterCorrectAnswer = 0;
  if (answers.length > 0) {
    answers.forEach((answer) => {
      if (answer.isCorrect) {
        counterCorrectAnswer++;
      }
    });
  }
  return counterCorrectAnswer >= 1;
}

function disableSwitch( question, answerIndex ) {
  if (checkIfQuestionIsTextType(question)) {
    return true;
  }
  if (checkIfQuestionIsSingleChoiceType(question) && question.answers[answerIndex].isCorrect !== true && checkIfCorrectAnswerIsSelected(question)
  ) {
    return true;
  }
  return false;
}

export {
  checkTypeOfQuestion,
  checkIfQuestionIsTextType,
  checkIfQuestionIsSingleChoiceType,
  checkIfQuestionIsMultipleChoiceType,
  checkIfCorrectAnswerIsSelected,
  disableSwitch,
};
