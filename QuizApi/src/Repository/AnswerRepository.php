<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Answer;
use App\Entity\Question;
use App\Entity\Quiz;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\Expr\Join;

/**
 * Class AnswerRepository
 *
 * @author Zygmunt Łata
 * @package App\Repository
 */
class AnswerRepository extends ServiceEntityRepository
{
    /**
     * AnswerRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Answer::class);
    }

    /**
     * @param int $id
     * @return Answer|null
     * @throws NonUniqueResultException
     */
    public function findAnswerById(int $id): ?Answer
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Answer::class,'A')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @param Question $question
     * @return Answer[]|null
     */
    public function findAllAnswersByQuestion(Question $question): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Answer::class,'A')
            ->where('A.question = :question')
            ->setParameter('question', $question);

        return $queryBuilder->getQuery()->getArrayResult();
    }

    /**
     * @param int $id
     * @return Answer[]|null
     */
    public function findAllAnswersByQuizId(int $id): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('C')
            ->from(Quiz::class,'A')
            ->innerJoin(Question::class, 'B', Join::WITH, 'B.quiz = A.id')
            ->innerJoin(Answer::class, 'C', Join::WITH, 'C.question = B.id')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @param Question $question
     * @return Answer[]|null
     */
    public function findAllCorrectAnswersIdByQuestion(Question $question): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A.id')
            ->from(Answer::class,'A')
            ->where('A.question = :question')
            ->setParameter('question', $question)
            ->andWhere('A.isCorrect = :isCorrect')
            ->setParameter('isCorrect', true);

        return $queryBuilder->getQuery()->getArrayResult();
    }

}