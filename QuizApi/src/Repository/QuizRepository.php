<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Quiz;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Class QuizRepository
 *
 * @author Zygmunt Łata
 * @package App\Repository
 */
class QuizRepository extends ServiceEntityRepository
{
    /**
     * QuizRepository constructor.
     *
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Quiz::class);
    }

    /**
     * @param int $id
     * @return Quiz|null
     * @throws NonUniqueResultException
     */
    public function findQuizById(int $id): ?Quiz
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Quiz::class,'A')
            ->where('A.id = :id')
            ->setParameter('id', $id);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    /**
     * @return Quiz[]|null
     */
    public function findAllQuizzes(): ?array
    {
        $queryBuilder = $this->getEntityManager()->createQueryBuilder()
            ->select('A')
            ->from(Quiz::class,'A');

        return $queryBuilder->getQuery()->getArrayResult();
    }

}