
const TYPE_QUESTION_TEXT = 1;
const TYPE_QUESTION_SINGLE_CHOICE = 2;
const TYPE_QUESTION_MULTIPLE_CHOICE = 3;

const questionTypes = [
  { id: TYPE_QUESTION_TEXT, name: 'Tekstowe' },
  { id: TYPE_QUESTION_SINGLE_CHOICE, name: 'Jednokrotnego wyboru' },
  { id: TYPE_QUESTION_MULTIPLE_CHOICE, name: 'Wielokrotnego wyboru' },
];

export {
  questionTypes,
  TYPE_QUESTION_TEXT,
  TYPE_QUESTION_SINGLE_CHOICE,
  TYPE_QUESTION_MULTIPLE_CHOICE,
};
