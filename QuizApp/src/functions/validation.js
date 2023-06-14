
/* Walidacja quizu */

import * as Yup from 'yup'

function validateQuizName( value ) {
  if (value === '') {
    return 'To pole jest wymagane.';
  } else if (value.length < 5) {
    return 'To pole musi zawierać minimalnie 5 znaków.';
  } else if (value.length > 255) {
    return 'To pole może zawierać maksymalnie 255 znaków.';
  }
}

function getValidationResultOfQuizName( value ) {
  if (value === '') {
    return true;
  } else if (value.length < 5) {
    return true;
  } else if (value.length > 255) {
    return true;
  }
  return false;
}

/* Walidacja pytań */

function validateQuestionName( value ) {
  if (value === '') {
    return 'To pole jest wymagane.';
  } else if (value.length < 5) {
    return 'To pole musi zawierać minimalnie 5 znaków.';
  } else if (value.length > 255) {
    return 'To pole może zawierać maksymalnie 255 znaków.';
  }
}

function getValidationResultOfQuestionName( value ) {
  if (value === '') {
    return true;
  } else if (value.length < 5) {
    return true;
  } else if (value.length > 255) {
    return true;
  }
  return false;
}

function validateArrayOfQuestions( value ) {
  if (value.length === 0) {
    return 'Dodanie pytań jest wymagane.';
  } else if (value.length < 3) {
    return 'Musi zostać dodane minimum 3 pytania.';
  }
}

function getValidationResultOfArrayOfQuestions( value ) {
  if (value.length === 0) {
    return true;
  } else if (value.length < 3) {
    return true;
  }
  return false;
}

/* Walidacja odpowiedzi */

function validateAnswerName( value ) {
  if (value === '') {
    return 'To pole jest wymagane.';
  } else if (value.length > 255) {
    return 'To pole może zawierać maksymalnie 255 znaków.';
  }
}

function getValidationResultOfAnswerName( value ) {
  if (value === '') {
    return true;
  } else if (value.length > 255) {
    return true;
  }
  return false;
}

function validateArrayOfAnswers( value ) {
  if (value.length === 0) {
    return 'Dodanie odpowiedzi jest wymagane.';
  }
}

function getValidationResultOfArrayOfAnswers( value ) {
  return value.length === 0;
}

/* Walidacja odpowiedzi na pytania */

function validateTextAnswerToQuestion( value ) {
  if (value === '') {
    return 'Udzielenie odpowiedzi jest wymagane.';
  } else if (value.length > 255) {
    return 'Odpowiedź tekstowa może zawierać maksymalnie 255 znaków.';
  }
}

function getValidationResultOfTextAnswerToQuestion( value ) {
  if (value === '') {
    return true;
  } else if (value.length > 255) {
    return true;
  }
  return false;
}

function validateArrayOfAnswersToQuestion( value ) {
  if (value.length === 0) {
    return 'Udzielenie odpowiedzi jest wymagane.';
  }
}

function getValidationResultOfArrayOfAnswersToQuestion( value ) {
  return value.length === 0;
}


export {
  validateQuizName,
  getValidationResultOfQuizName,
  validateQuestionName,
  getValidationResultOfQuestionName,
  validateArrayOfQuestions,
  getValidationResultOfArrayOfQuestions,
  validateAnswerName,
  getValidationResultOfAnswerName,
  validateArrayOfAnswers,
  getValidationResultOfArrayOfAnswers,
  validateTextAnswerToQuestion,
  getValidationResultOfTextAnswerToQuestion,
  validateArrayOfAnswersToQuestion,
  getValidationResultOfArrayOfAnswersToQuestion,
};
