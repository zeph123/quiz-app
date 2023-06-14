<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Answer;
use App\Entity\AnswerToQuestion;
use App\Entity\Question;
use App\Enum\QuestionTypeEnum;
use App\Repository\AnswerRepository;
use Doctrine\ORM\NonUniqueResultException;

class AnswerValidationService
{
    private QuestionTypeEnum $questionTypeEnum;
    private AnswerRepository $answerRepository;

    public function __construct(
        QuestionTypeEnum $questionTypeEnum,
        AnswerRepository $answerRepository
    )
    {
        $this->questionTypeEnum = $questionTypeEnum;
        $this->answerRepository = $answerRepository;
    }

    /**
     * @param Question $question
     * @param AnswerToQuestion|array $givenAnswers
     * @return bool
     * @throws NonUniqueResultException
     */
    public function checkCorrectnessOfGivenAnswerToQuestion(Question $question, AnswerToQuestion|array $givenAnswers): bool
    {
        /**
         * @var Answer[] $correctAnswersId
         */
        $correctAnswersId = $this->answerRepository->findAllCorrectAnswersIdByQuestion($question);

        switch ($question->getType()) {
            case $this->questionTypeEnum::TYPE_QUESTION_TEXT: {

                $correctAnswerId = (int) $correctAnswersId[0]["id"];
                /**
                 * @var Answer $correctAnswer
                 */
                $correctAnswer = $this->answerRepository->findAnswerById($correctAnswerId);
                /**
                 * @var AnswerToQuestion $givenAnswer
                 */
                $givenAnswer = $givenAnswers;

                return $givenAnswer->getTextAnswer() === $correctAnswer->getName();
            }
            case $this->questionTypeEnum::TYPE_QUESTION_SINGLE_CHOICE: {

                $correctAnswerId = (int) $correctAnswersId[0]["id"];
                /**
                 * @var Answer $correctAnswer
                 */
                $correctAnswer = $this->answerRepository->findAnswerById($correctAnswerId);
                /**
                 * @var AnswerToQuestion $givenAnswer
                 */
                $givenAnswer = $givenAnswers;

                return $givenAnswer->getAnswer()->getId() === $correctAnswer->getId();
            }
            case $this->questionTypeEnum::TYPE_QUESTION_MULTIPLE_CHOICE: {

                $correctAnswersIdWithoutKeys = [];
                foreach ($correctAnswersId as $correctAnswerId) {
                    $correctAnswersIdWithoutKeys[] = $correctAnswerId["id"];
                }

                if (count($givenAnswers) !== count($correctAnswersIdWithoutKeys)) {
                    return false;
                }

                /**
                 * @var AnswerToQuestion $givenAnswer
                 */
                foreach ($givenAnswers as $givenAnswer) {
                    if (!in_array($givenAnswer->getAnswer()->getId(), $correctAnswersIdWithoutKeys, true)) {
                        return false;
                    }
                }

                return true;
            }
        }
    }

    /**
     * @param Question $question
     * @param AnswerToQuestion|array $givenAnswers
     * @return int
     * @throws NonUniqueResultException
     */
    public function calculatePointsByGivenAnswerToQuestion(Question $question, AnswerToQuestion|array $givenAnswers): int
    {
        if ($this->checkCorrectnessOfGivenAnswerToQuestion($question, $givenAnswers)) {
            return 1;
        }

        return 0;
    }

}