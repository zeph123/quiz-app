<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AnswerToQuestion;
use App\Entity\QuizAttempt;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Class AnswerToQuestionRepository
 *
 * @author Zygmunt Łata
 * @package App\Repository
 */
class AnswerToQuestionRepository extends ServiceEntityRepository
{
    /**
     * AnswerToQuestionRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AnswerToQuestion::class);
    }

    /**
     * @param int $id
     * @return AnswerToQuestion|null
     * @throws NonUniqueResultException
     */
    public function findAnswerToQuestionById(int $id): ?AnswerToQuestion
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(AnswerToQuestion::class,'A')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param QuizAttempt $quizAttempt
     * @return AnswerToQuestion[]|null
     */
    public function findAnswersToQuestionByQuizAttempt(QuizAttempt $quizAttempt): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(AnswerToQuestion::class,'A')
            ->where('A.quizAttempt = :quizAttempt')
            ->setParameter('quizAttempt', $quizAttempt);

        return $queryBuilder->getQuery()->getResult();
    }

}