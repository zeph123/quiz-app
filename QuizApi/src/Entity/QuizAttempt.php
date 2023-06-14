<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\QuizAttemptRepository;
use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * Class QuizAttempt
 *
 * @author Zygmunt Łata
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: QuizAttemptRepository::class)]
#[ORM\Table(name: "quiz_attempt", schema: "public")]
class QuizAttempt
{
    /**
     * @var int $id
     */
    #[ORM\Id, ORM\Column(name: "id", type: "integer", unique: true, nullable: false), ORM\GeneratedValue(strategy: "IDENTITY")]
    private int $id;

    /**
     * @var int $attemptNumber
     */
    #[ORM\Column(name: "attempt_number", type: "integer", nullable: false)]
    private int $attemptNumber;

    /**
     * @var DateTime $attemptDate
     */
    #[ORM\Column(name: "attempt_date", type: "datetime", nullable: false)]
    private DateTime $attemptDate;

    /**
     * @var float|null $earnedScore
     */
    #[ORM\Column(name: "earned_score", type: "float", nullable: true)]
    private ?float $earnedScore = null;

    /**
     * @var Quiz $quiz
     */
    #[ORM\ManyToOne(targetEntity: Quiz::class)]
    #[ORM\JoinColumn(name: "quiz_id", referencedColumnName: "id", nullable: false)]
    private Quiz $quiz;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getAttemptNumber(): int
    {
        return $this->attemptNumber;
    }

    /**
     * @param int $attemptNumber
     */
    public function setAttemptNumber(int $attemptNumber): void
    {
        $this->attemptNumber = $attemptNumber;
    }

    /**
     * @return DateTime
     */
    public function getAttemptDate(): DateTime
    {
        return $this->attemptDate;
    }

    /**
     * @param DateTime $attemptDate
     */
    public function setAttemptDate(DateTime $attemptDate): void
    {
        $this->attemptDate = $attemptDate;
    }

    /**
     * @return float|null
     */
    public function getEarnedScore(): ?float
    {
        return $this->earnedScore;
    }

    /**
     * @param float|null $earnedScore
     */
    public function setEarnedScore(?float $earnedScore): void
    {
        $this->earnedScore = $earnedScore;
    }

    /**
     * @return Quiz
     */
    public function getQuiz(): Quiz
    {
        return $this->quiz;
    }

    /**
     * @param Quiz $quiz
     */
    public function setQuiz(Quiz $quiz): void
    {
        $this->quiz = $quiz;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'attemptNumber' => $this->getAttemptNumber(),
            'attemptDate' => $this->getAttemptDate()->format("H:i:s d-m-Y"),
            'earnedScore' => $this->getEarnedScore(),
            'maxPoints' => 0,
            'quiz' => [],
            'givenAnswers' => [],
        ];
    }

}