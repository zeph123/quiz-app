<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\QuizRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Class Quiz
 *
 * @author Zygmunt Łata
 * @package App\Entity
 */
#[ORM\Entity(repositoryClass: QuizRepository::class)]
#[ORM\Table(name: "quiz", schema: "public")]
class Quiz
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'questions' => [],
        ];
    }

}