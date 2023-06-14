<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AnswerRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Class Answer
 *
 * @author Zygmunt Łata
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: AnswerRepository::class)]
#[ORM\Table(name: "answer", schema: "public")]
class Answer
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
     * @var bool|null $isCorrect
     */
    #[ORM\Column(name: "is_correct", type: "boolean", nullable: true, options: ["default" => false])]
    private ?bool $isCorrect = null;

    /**
     * @var int $orderNumber
     */
    #[ORM\Column(name: "order_number", type: "integer", nullable: false)]
    private int $orderNumber;

    /**
     * @var Question $question
     */
    #[ORM\ManyToOne(targetEntity: Question::class)]
    #[ORM\JoinColumn(name: "question_id", referencedColumnName: "id", nullable: false)]
    private Question $question;

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
     * @return bool|null
     */
    public function getIsCorrect(): ?bool
    {
        return $this->isCorrect;
    }

    /**
     * @param bool|null $isCorrect
     */
    public function setIsCorrect(?bool $isCorrect): void
    {
        $this->isCorrect = $isCorrect;
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'isCorrect' => $this->getIsCorrect(),
            'orderNumber' => $this->getOrderNumber(),
            'questionId' => $this->getQuestion()->getId(),
        ];
    }

}