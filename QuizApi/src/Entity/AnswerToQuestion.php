<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AnswerToQuestionRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Class AnswerToQuestion
 *
 * @author Zygmunt Łata
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: AnswerToQuestionRepository::class)]
#[ORM\Table(name: "answer_to_question", schema: "public")]
class AnswerToQuestion
{
    /**
     * @var int $id
     */
    #[ORM\Id, ORM\Column(name: "id", type: "integer", unique: true, nullable: false), ORM\GeneratedValue(strategy: "IDENTITY")]
    private int $id;

    /**
     * @var Question $question
     */
    #[ORM\ManyToOne(targetEntity: Question::class)]
    #[ORM\JoinColumn(name: "question_id", referencedColumnName: "id", nullable: false)]
    private Question $question;

    /**
     * @var Answer|null $answer
     */
    #[ORM\ManyToOne(targetEntity: Answer::class)]
    #[ORM\JoinColumn(name: "answer_id", referencedColumnName: "id", nullable: true)]
    private ?Answer $answer = null;

    /**
     * @var string|null $textAnswer
     */
    #[ORM\Column(name: "text_answer", type: "string", length: 255, nullable: true)]
    private ?string $textAnswer = null;

    /**
     * @var QuizAttempt $quizAttempt
     */
    #[ORM\ManyToOne(targetEntity: QuizAttempt::class)]
    #[ORM\JoinColumn(name: "quiz_attempt_id", referencedColumnName: "id", nullable: false)]
    private QuizAttempt $quizAttempt;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return Question
     */
    public function getQuestion(): Question
    {
        return $this->question;
    }

    /**
     * @param Question $question
     */
    public function setQuestion(Question $question): void
    {
        $this->question = $question;
    }

    /**
     * @return Answer|null
     */
    public function getAnswer(): ?Answer
    {
        return $this->answer;
    }

    /**
     * @param Answer|null $answer
     */
    public function setAnswer(?Answer $answer): void
    {
        $this->answer = $answer;
    }

    /**
     * @return string|null
     */
    public function getTextAnswer(): ?string
    {
        return $this->textAnswer;
    }

    /**
     * @param string|null $textAnswer
     */
    public function setTextAnswer(?string $textAnswer): void
    {
        $this->textAnswer = $textAnswer;
    }

    /**
     * @return QuizAttempt
     */
    public function getQuizAttempt(): QuizAttempt
    {
        return $this->quizAttempt;
    }

    /**
     * @param QuizAttempt $quizAttempt
     */
    public function setQuizAttempt(QuizAttempt $quizAttempt): void
    {
        $this->quizAttempt = $quizAttempt;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'quizAttemptId' => $this->getQuizAttempt()->getId(),
            'questionId' => $this->getQuestion()->getId(),
            'answerId' => $this->getAnswer()?->getId(),
            'textAnswer' => $this->getTextAnswer()
        ];
    }

}