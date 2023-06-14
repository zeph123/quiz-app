<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\QuestionRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Class Question
 *
 * @author Zygmunt Łata
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: QuestionRepository::class)]
#[ORM\Table(name: "question", schema: "public")]
class Question
{
    /**
     * @var int $id
     */
    #[ORM\Id, ORM\Column(name: "id", type: "integer", unique: true, nullable: false), ORM\GeneratedValue(strategy: "IDENTITY")]
    private int $id;

    /**
     * @var string $name
     */
    #[ORM\Column(name: "name", type: "string", length: 255, nullable: false)]
    private string $name;

    /**
     * @var int $type
     */
    #[ORM\Column(name: "type", type: "integer", nullable: false)]
    private int $type;

    /**
     * @var int $orderNumber
     */
    #[ORM\Column(name: "order_number", type: "integer", nullable: false)]
    private int $orderNumber;

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
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param int $type
     */
    public function setType(int $type): void
    {
        $this->type = $type;
    }

    /**
     * @return int
     */
    public function getOrderNumber(): int
    {
        return $this->orderNumber;
    }

    /**
     * @param int $orderNumber
     */
    public function setOrderNumber(int $orderNumber): void
    {
        $this->orderNumber = $orderNumber;
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
            'name' => $this->getName(),
            'type' => $this->getType(),
            'orderNumber' => $this->getOrderNumber(),
            'quizId' => $this->getQuiz()->getId(),
            'answers' => [],
        ];
    }

}