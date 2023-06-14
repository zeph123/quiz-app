<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Question;
use App\Entity\Quiz;
use App\Entity\QuizAttempt;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Class QuizAttemptRepository
 *
 * @author Zygmunt Łata
 * @package App\Repository
 */
class QuizAttemptRepository extends ServiceEntityRepository
{
    /**
     * QuizAttemptRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuizAttempt::class);
    }

    /**
     * @param int $id
     * @return QuizAttempt|null
     * @throws NonUniqueResultException
     */
    public function findQuizAttemptById(int $id): ?QuizAttempt
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(QuizAttempt::class,'A')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param Quiz $quiz
     * @return int|null
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function calculateQuizAttemptByQuiz(Quiz $quiz): ?int
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('count(A.quiz)')
            ->from(QuizAttempt::class,'A')
            ->where('A.quiz = :quiz')
            ->setParameter('quiz', $quiz);

        return $queryBuilder->getQuery()->getSingleScalarResult();
    }

    /**
     * @param Quiz $quiz
     * @return QuizAttempt|null
     * @throws NonUniqueResultException
     */
    public function findLastQuizAttemptByQuiz(Quiz $quiz): ?QuizAttempt
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(QuizAttempt::class,'A')
            ->where('A.quiz = :quiz')
            ->setParameter('quiz', $quiz)
            ->orderBy('A.attemptNumber', 'DESC')
            ->setMaxResults(1);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param Quiz $quiz
     * @return mixed
     */
    public function findAllQuizAttemptsByQuiz(Quiz $quiz): mixed
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(QuizAttempt::class,'A')
            ->where('A.quiz = :quiz')
            ->setParameter('quiz', $quiz);

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @param int $id
     * @return int|null
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function calculateMaxPointsByQuizId(int $id): ?int
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('count(B.id)')
            ->from(Quiz::class,'A')
            ->innerJoin(Question::class, 'B', Join::WITH, 'B.quiz = A.id')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getSingleScalarResult();
    }

}