<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Answer;
use App\Entity\AnswerToQuestion;
use App\Entity\Question;
use App\Entity\Quiz;
use App\Entity\QuizAttempt;
use App\Enum\QuestionTypeEnum;
use App\Repository\AnswerRepository;
use App\Repository\AnswerToQuestionRepository;
use App\Repository\QuestionRepository;
use App\Repository\QuizAttemptRepository;
use App\Repository\QuizRepository;
use App\Services\AnswerValidationService;
use DateTime;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use JsonException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class QuizController
 *
 * @author Zygmunt Łata
 * @package App\Controller
 */
class QuizController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private QuestionTypeEnum $questionTypeEnum;
    private QuizRepository $quizRepository;
    private QuestionRepository $questionRepository;
    private AnswerRepository $answerRepository;
    private QuizAttemptRepository $quizAttemptRepository;
    private AnswerValidationService $answerValidationService;
    private AnswerToQuestionRepository $answerToQuestionRepository;

    /**
     * QuizController constructor.
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        QuestionTypeEnum $questionTypeEnum,
        QuizRepository $quizRepository,
        QuestionRepository $questionRepository,
        AnswerRepository $answerRepository,
        QuizAttemptRepository $quizAttemptRepository,
        AnswerValidationService $answerValidationService,
        AnswerToQuestionRepository $answerToQuestionRepository,
    )
    {
        $this->entityManager = $entityManager;
        $this->questionTypeEnum = $questionTypeEnum;
        $this->quizRepository = $quizRepository;
        $this->questionRepository = $questionRepository;
        $this->answerRepository = $answerRepository;
        $this->quizAttemptRepository = $quizAttemptRepository;
        $this->answerValidationService = $answerValidationService;
        $this->answerToQuestionRepository = $answerToQuestionRepository;
    }

    /**
     * @return JsonResponse
     */
    #[Route('/quizzes', name: 'getAllQuizzes', methods: ['GET'])]
    public function getAllQuizzes(): JsonResponse
    {
        /**
         * @var Quiz[]|null $quizzes
         */
        $quizzes = $this->quizRepository->findAllQuizzes();

        if (!$quizzes) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizów.',
            ]);
        }

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie odnaleziono wszystkie quizy.',
            'data' => $quizzes,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws JsonException
     */
    #[Route('/quizzes', name: 'addQuiz', methods: ['POST'])]
    public function addQuiz(Request $request): JsonResponse
    {
        // Getting data from request.
        $parameters = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);

        $quiz = $parameters->quiz;
        $questions = $parameters->questions;

        $newQuiz = new Quiz();
        $newQuiz->setName($quiz->name);

        $this->entityManager->persist($newQuiz);

        if (count($questions) !== 0) {
            foreach ($questions as $question) {

                $newQuestion = new Question();
                $newQuestion->setName($question->name);
                $newQuestion->setType((int) $question->type);
                $newQuestion->setOrderNumber($question->orderNumber);
                $newQuestion->setQuiz($newQuiz);

                $this->entityManager->persist($newQuestion);

                if (count($question->answers) !== 0) {
                    foreach ($question->answers as $answer) {

                        $newAnswer = new Answer();
                        $newAnswer->setName($answer->name);
                        $newAnswer->setIsCorrect($answer->isCorrect);
                        $newAnswer->setOrderNumber($answer->orderNumber);
                        $newAnswer->setQuestion($newQuestion);

                        $this->entityManager->persist($newAnswer);
                    }
                } else {
                    return new JsonResponse([
                        'statusCode' => Response::HTTP_BAD_REQUEST,
                        'message' => 'Nie dodano żadnych odpowiedzi w quizie do pytania o ID: '.$question->id.'.'
                    ]);
                }
            }
        } else {
            return new JsonResponse([
                'statusCode' => Response::HTTP_BAD_REQUEST,
                'message' => 'Nie dodano żadnych pytań do quizu.'
            ]);
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie dodano quiz.'
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    #[Route('/quizzes/{id}', name: 'getQuizById', methods: ['GET'])]
    public function getQuizById(string $id): JsonResponse
    {
        $quizId = (int) $id;
        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Question[]|null $questions
         */
        $questions = $this->questionRepository->findAllQuestionsByQuiz($quiz);

        if (!$questions) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Answer[]|null $answers
         */
        $answers = $this->answerRepository->findAllAnswersByQuizId($quiz->getId());
        if (!$answers) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi do pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        $data = $quiz->toArray();

        foreach ($questions as $question) {
            $data['questions'][] = $question->toArray();
        }

        $dataQuestion = [];
        foreach ($data['questions'] as $question) {
            foreach ($answers as $answer) {
                if ($answer->getQuestion()->getId() === $question['id']) {
                    $question['answers'][] = $answer->toArray();
                }
            }
            $dataQuestion[] = $question;
        }
        $data['questions'] = $dataQuestion;

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie odnaleziono quiz o ID: '.$quizId.'.',
            'data' => $data,
        ]);
    }

    /**
     * @param string $id
     * @param Request $request
     * @return JsonResponse
     * @throws JsonException
     * @throws NonUniqueResultException
     */
    #[Route('/quizzes/{id}', name: 'updateQuizById', methods: ['PUT'])]
    public function updateQuizById(string $id, Request $request): JsonResponse
    {
        $quizId = (int) $id;

        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Question[]|null $questions
         */
        $questions = $this->questionRepository->findAllQuestionsByQuiz($quiz);

        if (!$questions) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Answer[]|null $answers
         */
        $answers = $this->answerRepository->findAllAnswersByQuizId($quiz->getId());
        if (!$answers) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi do pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        // Delete old answers to questions.
        foreach ($answers as $answer) {
            $this->entityManager->remove($answer);
        }

        // Delete old questions.
        foreach ($questions as $question) {
            $this->entityManager->remove($question);
        }

        /**
         * @var mixed|null $quizAttempts
         */
        $quizAttempts = $this->quizAttemptRepository->findAllQuizAttemptsByQuiz($quiz);

        if ($quizAttempts !== null) {
            /**
             * @var QuizAttempt $quizAttempt
             */
            foreach ($quizAttempts as $quizAttempt) {

                /**
                 * @var AnswerToQuestion[]|null $answersToQuestion
                 */
                $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($quizAttempt);

                if (!$answersToQuestion) {
                    return new JsonResponse([
                        'statusCode' => Response::HTTP_NOT_FOUND,
                        'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do podejścia do quizu o ID: '.$quizAttempt->getId().'.',
                    ]);
                }

                foreach ($answersToQuestion as $answerToQuestion) {
                    $this->entityManager->remove($answerToQuestion);
                }

                $this->entityManager->remove($quizAttempt);
            }
        }

        // Getting data from request.
        $parameters = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);

        $newQuizName = $parameters->name;
        $newQuizQuestions = $parameters->questions;

        // Save new data to existing quiz.

        $quiz->setName($newQuizName);

        $this->entityManager->persist($quiz);

        if (count($newQuizQuestions) !== 0) {
            foreach ($newQuizQuestions as $question) {

                $newQuestion = new Question();
                $newQuestion->setName($question->name);
                $newQuestion->setType((int) $question->type);
                $newQuestion->setOrderNumber($question->orderNumber);
                $newQuestion->setQuiz($quiz);

                $this->entityManager->persist($newQuestion);

                if (count($question->answers) !== 0) {
                    foreach ($question->answers as $answer) {

                        $newAnswer = new Answer();
                        $newAnswer->setName($answer->name);
                        $newAnswer->setIsCorrect($answer->isCorrect);
                        $newAnswer->setOrderNumber($answer->orderNumber);
                        $newAnswer->setQuestion($newQuestion);

                        $this->entityManager->persist($newAnswer);
                    }
                } else {
                    return new JsonResponse([
                        'statusCode' => Response::HTTP_BAD_REQUEST,
                        'message' => 'Nie dodano żadnych odpowiedzi w quizie do pytania o ID: '.$question->id.'.'
                    ]);
                }
            }
        } else {
            return new JsonResponse([
                'statusCode' => Response::HTTP_BAD_REQUEST,
                'message' => 'Nie dodano żadnych pytań do quizu.'
            ]);
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie zaktualizowano quiz.',
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    #[Route('/quizzes/{id}', name: 'deleteQuizById', methods: ['DELETE'])]
    public function deleteQuizById(string $id): JsonResponse
    {
        $quizId = (int) $id;
        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Question[]|null $questions
         */
        $questions = $this->questionRepository->findAllQuestionsByQuiz($quiz);

        if (!$questions) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Answer[]|null $answers
         */
        $answers = $this->answerRepository->findAllAnswersByQuizId($quiz->getId());
        if (!$answers) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi do pytań dla quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var mixed|null $quizAttempts
         */
        $quizAttempts = $this->quizAttemptRepository->findAllQuizAttemptsByQuiz($quiz);

        if ($quizAttempts !== null) {
            /**
             * @var QuizAttempt $quizAttempt
             */
            foreach ($quizAttempts as $quizAttempt) {

                /**
                 * @var AnswerToQuestion[]|null $answersToQuestion
                 */
                $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($quizAttempt);

                if (!$answersToQuestion) {
                    return new JsonResponse([
                        'statusCode' => Response::HTTP_NOT_FOUND,
                        'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do podejścia do quizu o ID: ' . $quizAttempt->getId() . '.',
                    ]);
                }

                foreach ($answersToQuestion as $answerToQuestion) {
                    $this->entityManager->remove($answerToQuestion);
                }

                $this->entityManager->remove($quizAttempt);
            }
        }

        foreach ($answers as $answer) {
            $this->entityManager->remove($answer);
        }

        foreach ($questions as $question) {
            $this->entityManager->remove($question);
        }

        $this->entityManager->remove($quiz);

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie usunięto quiz.',
        ]);
    }

    /**
     * @param string $id
     * @param Request $request
     * @return JsonResponse
     * @throws JsonException
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    #[Route('/solveQuiz/{id}', name: 'solveQuizById', methods: ['POST'])]
    public function solveQuizById(string $id, Request $request): JsonResponse
    {
        $quizId = (int) $id;

        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        $attemptScore = 0;
        $attemptNumber = $this->quizAttemptRepository->calculateQuizAttemptByQuiz($quiz) + 1;
        $attemptDate = new DateTime();

        $newQuizAttempt = new QuizAttempt();
        $newQuizAttempt->setQuiz($quiz);
        $newQuizAttempt->setAttemptNumber($attemptNumber);
        $newQuizAttempt->setAttemptDate($attemptDate);

        // Getting data from request.
        $parameters = json_decode($request->getContent(), false, 512, JSON_THROW_ON_ERROR);
        $answers = $parameters->answers;

        foreach ($answers as $answer) {

            $questionId = $answer->questionId;
            /**
             * @var Question|null $question
             */
            $question = $this->questionRepository->findQuestionById($questionId);

            if (!$question) {
                return new JsonResponse([
                    'statusCode' => Response::HTTP_NOT_FOUND,
                    'message' => 'Wystąpił błąd, nie udało się odnaleźć pytania o ID: '.$questionId.' dla quizu o ID: '.$quizId.'.',
                ]);
            }

            switch ($question->getType()) {
                case $this->questionTypeEnum::TYPE_QUESTION_TEXT: {

                    $textAnswer = $answer->textAnswer;

                    $answerToQuestion = new AnswerToQuestion();
                    $answerToQuestion->setQuestion($question);
                    $answerToQuestion->setAnswer(null);
                    $answerToQuestion->setTextAnswer($textAnswer);
                    $answerToQuestion->setQuizAttempt($newQuizAttempt);

                    $this->entityManager->persist($answerToQuestion);

                    $attemptScore += $this->answerValidationService->calculatePointsByGivenAnswerToQuestion($question, $answerToQuestion);

                    break;
                }
                case $this->questionTypeEnum::TYPE_QUESTION_SINGLE_CHOICE: {

                    $checkedAnswerId = $answer->checkedAnswersId;
                    // there are no more answers
                    // there is no need to loop through the single element array

                    /**
                     * @var Answer|null $answer
                     */
                    $answer = $this->answerRepository->findAnswerById($checkedAnswerId[0]);

                    if (!$answer) {
                        return new JsonResponse([
                            'statusCode' => Response::HTTP_NOT_FOUND,
                            'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi o ID: '.$checkedAnswerId[0].' dla quizu o ID: '.$quizId.'.',
                        ]);
                    }

                    $answerToQuestion = new AnswerToQuestion();
                    $answerToQuestion->setQuestion($question);
                    $answerToQuestion->setAnswer($answer);
                    $answerToQuestion->setTextAnswer(null);
                    $answerToQuestion->setQuizAttempt($newQuizAttempt);

                    $this->entityManager->persist($answerToQuestion);

                    $attemptScore += $this->answerValidationService->calculatePointsByGivenAnswerToQuestion($question, $answerToQuestion);

                    break;
                }
                case $this->questionTypeEnum::TYPE_QUESTION_MULTIPLE_CHOICE: {

                    $checkedAnswersId = $answer->checkedAnswersId;
                    asort($checkedAnswersId, SORT_NUMERIC);

                    $givenAnswers = [];

                    foreach ($checkedAnswersId as $answerId) {

                        /**
                         * @var Answer|null $answer
                         */
                        $answer = $this->answerRepository->findAnswerById($answerId);

                        if (!$answer) {
                            return new JsonResponse([
                                'statusCode' => Response::HTTP_NOT_FOUND,
                                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi o ID: '.$answerId.' dla quizu o ID: '.$quizId.'.',
                            ]);
                        }

                        $answerToQuestion = new AnswerToQuestion();
                        $answerToQuestion->setQuestion($question);
                        $answerToQuestion->setAnswer($answer);
                        $answerToQuestion->setTextAnswer(null);
                        $answerToQuestion->setQuizAttempt($newQuizAttempt);

                        $this->entityManager->persist($answerToQuestion);

                        $givenAnswers[] = $answerToQuestion;
                    }

//                    foreach ($givenAnswers as $givenAnswer) {
//                        dump('id: '.$givenAnswer->getAnswer()->getId().', odp: '.$givenAnswer->getAnswer()->getName());
//                    }

                    $attemptScore += $this->answerValidationService->calculatePointsByGivenAnswerToQuestion($question, $givenAnswers);

                    break;
                }
            }

        }

        $newQuizAttempt->setEarnedScore($attemptScore);

        $this->entityManager->persist($newQuizAttempt);

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie rozwiązano quiz.',
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     * @throws NoResultException
     */
    #[Route('/quizAttempt/{id}', name: 'getLastQuizAttemptByQuiz', methods: ['GET'])]
    public function getLastQuizAttemptByQuiz(string $id): JsonResponse
    {
        $quizId = (int) $id;
        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var int|null $maxPoints
         */
        $maxPoints = $this->quizAttemptRepository->calculateMaxPointsByQuizId($quizId);

        /**
         * @var QuizAttempt|null $lastQuizAttempt
         */
        $lastQuizAttempt = $this->quizAttemptRepository->findLastQuizAttemptByQuiz($quiz);

        if (!$lastQuizAttempt) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć ostatniego podejścia do quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var AnswerToQuestion[]|null $answersToQuestion
         */
        $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($lastQuizAttempt);

        if (!$answersToQuestion) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do ostatniego podejścia do quizu o ID: '.$quizId.'.',
            ]);
        }

        $data = $lastQuizAttempt->toArray();

        foreach ($answersToQuestion as $answerToQuestion) {
            $data['givenAnswers'][] = $answerToQuestion->toArray();
        }

        $data['maxPoints'] = $maxPoints;

        /**
         * @var Question[]|null $questions
         */
        $questions = $this->questionRepository->findAllQuestionsByQuiz($quiz);

        if (!$questions) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć pytań do quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Answer[]|null $answers
         */
        $answers = $this->answerRepository->findAllAnswersByQuizId($quiz->getId());
        if (!$answers) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi do pytań do quizu o ID: '.$quizId.'.',
            ]);
        }

        $dataQuiz = $quiz->toArray();

        foreach ($questions as $question) {
            $dataQuiz['questions'][] = $question->toArray();
        }

        $dataQuestion = [];
        foreach ($dataQuiz['questions'] as $question) {
            foreach ($answers as $answer) {
                if ($answer->getQuestion()->getId() === $question['id']) {
                    $question['answers'][] = $answer->toArray();
                }
            }
            $dataQuestion[] = $question;
        }
        $dataQuiz['questions'] = $dataQuestion;

        $data['quiz'] = $dataQuiz;

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie odnaleziono ostatnie podejście do quizu o ID: '.$quizId.'.',
            'data' => $data,
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     * @throws NoResultException
     */
    #[Route('/allQuizAttempts/{id}', name: 'getAllQuizAttemptsByQuiz', methods: ['GET'])]
    public function getAllQuizAttemptsByQuiz(string $id): JsonResponse
    {
        $quizId = (int) $id;
        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
//            return new JsonResponse(
//                ['message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.'],
//                Response::HTTP_NOT_FOUND
//            );
        }

        /**
         * @var mixed|null $quizAttempts
         */
        $quizAttempts = $this->quizAttemptRepository->findAllQuizAttemptsByQuiz($quiz);

        if (!$quizAttempts) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć podejść do quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Question[]|null $questions
         */
        $questions = $this->questionRepository->findAllQuestionsByQuiz($quiz);

        if (!$questions) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć pytań do quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var Answer[]|null $answers
         */
        $answers = $this->answerRepository->findAllAnswersByQuizId($quiz->getId());
        if (!$answers) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć odpowiedzi do pytań do quizu o ID: '.$quizId.'.',
            ]);
        }

        $dataQuiz = $quiz->toArray();

        foreach ($questions as $question) {
            $dataQuiz['questions'][] = $question->toArray();
        }

        $dataQuestion = [];
        foreach ($dataQuiz['questions'] as $question) {
            foreach ($answers as $answer) {
                if ($answer->getQuestion()->getId() === $question['id']) {
                    $question['answers'][] = $answer->toArray();
                }
            }
            $dataQuestion[] = $question;
        }
        $dataQuiz['questions'] = $dataQuestion;

        $data = [];

        /**
         * @var QuizAttempt|null $quizAttempt
         */
        foreach ($quizAttempts as $quizAttempt) {
            $data[] = $quizAttempt->toArray();
        }

        $dataQuizAttempts = [];
        foreach ($data as $quizAttemptArray) {

            $quizAttemptId = (int) $quizAttemptArray["id"];

            /**
             * @var QuizAttempt|null $quizAttempt
             */
            $quizAttempt = $this->quizAttemptRepository->findQuizAttemptById($quizAttemptId);

            if (!$quizAttempt) {
                return new JsonResponse([
                    'statusCode' => Response::HTTP_NOT_FOUND,
                    'message' => 'Wystąpił błąd, nie udało się odnaleźć podejścia do quizu o ID: '.$quizAttemptId.'.',
                ]);
            }

            /**
             * @var AnswerToQuestion[]|null $answersToQuestion
             */
            $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($quizAttempt);

            if (!$answersToQuestion) {
                return new JsonResponse([
                    'statusCode' => Response::HTTP_NOT_FOUND,
                    'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do podejścia do quizu o ID: '.$quizId.'.',
                ]);
            }

            foreach ($answersToQuestion as $answerToQuestion) {
                $quizAttemptArray['givenAnswers'][] = $answerToQuestion->toArray();
            }

            /**
             * @var int|null $maxPoints
             */
            $maxPoints = $this->quizAttemptRepository->calculateMaxPointsByQuizId($quizId);

            $quizAttemptArray['maxPoints'] = $maxPoints;

            $quizAttemptArray['quiz'] = $dataQuiz;

            $dataQuizAttempts[] = $quizAttemptArray;
        }

        $data = $dataQuizAttempts;

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie odnaleziono wszystkie podejścia do quizu o ID: '.$quizId.'.',
            'data' => $data,
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    #[Route('/quizAttempt/{id}', name: 'deleteQuizAttemptById', methods: ['DELETE'])]
    public function deleteQuizAttemptById(string $id): JsonResponse
    {
        $quizAttemptId = (int) $id;

        /**
         * @var QuizAttempt|null $quizAttempt
         */
        $quizAttempt = $this->quizAttemptRepository->findQuizAttemptById($quizAttemptId);

        if (!$quizAttempt) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć podejścia do quizu o ID: '.$quizAttemptId.'.',
            ]);
        }

        /**
         * @var AnswerToQuestion[]|null $answersToQuestion
         */
        $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($quizAttempt);

        if (!$answersToQuestion) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do podejścia do quizu o ID: '.$quizAttemptId.'.',
            ]);
        }

        $quizId = $quizAttempt->getQuiz()->getId();

        foreach ($answersToQuestion as $answerToQuestion) {
            $this->entityManager->remove($answerToQuestion);
        }

        $this->entityManager->remove($quizAttempt);

        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var mixed|null $quizAttempts
         */
        $quizAttempts = $this->quizAttemptRepository->findAllQuizAttemptsByQuiz($quiz);

        $attemptNumber = 1;

        if (count($quizAttempts) > 0) {
            /**
             * @var QuizAttempt $quizAttemptTemp
             */
            foreach ($quizAttempts as $quizAttemptTemp) {
                if ($quizAttemptTemp->getId() !== $quizAttemptId) {
                    $quizAttemptTemp->setAttemptNumber($attemptNumber);
                    $attemptNumber++;
                }
            }
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie usunięto podejście do quizu.',
        ]);
    }

    /**
     * @param string $id
     * @return JsonResponse
     * @throws NonUniqueResultException
     */
    #[Route('/allQuizAttempts/{id}', name: 'deleteAllQuizAttemptsByQuiz', methods: ['DELETE'])]
    public function deleteAllQuizAttemptsByQuiz(string $id): JsonResponse
    {
        $quizId = (int) $id;

        /**
         * @var Quiz|null $quiz
         */
        $quiz = $this->quizRepository->findQuizById($quizId);

        if (!$quiz) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var mixed|null $quizAttempts
         */
        $quizAttempts = $this->quizAttemptRepository->findAllQuizAttemptsByQuiz($quiz);

        if (!$quizAttempts) {
            return new JsonResponse([
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => 'Wystąpił błąd, nie udało się odnaleźć podejść do quizu o ID: '.$quizId.'.',
            ]);
        }

        /**
         * @var QuizAttempt $quizAttempt
         */
        foreach ($quizAttempts as $quizAttempt) {

            /**
             * @var AnswerToQuestion[]|null $answersToQuestion
             */
            $answersToQuestion = $this->answerToQuestionRepository->findAnswersToQuestionByQuizAttempt($quizAttempt);

            if (!$answersToQuestion) {
                return new JsonResponse([
                    'statusCode' => Response::HTTP_NOT_FOUND,
                    'message' => 'Wystąpił błąd, nie udało się odnaleźć udzielonych odpowiedzi na pytania do podejścia do quizu o ID: '.$quizAttempt->getId().'.',
                ]);
            }

            foreach ($answersToQuestion as $answerToQuestion) {
                $this->entityManager->remove($answerToQuestion);
            }

            $this->entityManager->remove($quizAttempt);
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'statusCode' => Response::HTTP_OK,
            'message' => 'Pomyślnie usunięto wszystkie podejścia do quizu.',
        ]);
    }

}