<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Question;
use App\Entity\Quiz;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Class QuestionRepository
 *
 * @author Zygmunt Łata
 * @package App\Repository
 */
class QuestionRepository extends ServiceEntityRepository
{
    /**
     * QuestionRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Question::class);
    }

    /**
     * @param int $id
     * @return Question|null
     * @throws NonUniqueResultException
     */
    public function findQuestionById(int $id): ?Question
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Question::class,'A')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param Quiz $quiz
     * @return Question[]|null
     */
    public function findAllQuestionsByQuiz(Quiz $quiz): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Question::class,'A')
            ->where('A.quiz = :quiz')
            ->setParameter('quiz', $quiz);

        return $queryBuilder->getQuery()->getResult();
    }

}