<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230115145705 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA IF NOT EXISTS public');

        /** TABLE quiz */
        $this->addSql('CREATE TABLE public.quiz (
                            id INT GENERATED ALWAYS AS IDENTITY, 
                            name VARCHAR(255) NOT NULL, 
                            PRIMARY KEY(id))');

        /** TABLE question */
        $this->addSql('CREATE TABLE public.question (
                            id INT GENERATED ALWAYS AS IDENTITY, 
                            quiz_id INT NOT NULL, 
                            name VARCHAR(255) NOT NULL, 
                            type INT NOT NULL, 
                            order_number INT NOT NULL,
                            PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_741B9227853CD175 ON public.question (quiz_id)');
        $this->addSql('ALTER TABLE public.question 
                            ADD CONSTRAINT FK_741B9227853CD175 
                            FOREIGN KEY (quiz_id) 
                            REFERENCES public.quiz (id) 
                            ON DELETE CASCADE');


        /** TABLE answer */
        $this->addSql('CREATE TABLE public.answer (
                            id INT GENERATED ALWAYS AS IDENTITY, 
                            question_id INT NOT NULL, 
                            name VARCHAR(255) NOT NULL, 
                            is_correct BOOLEAN DEFAULT false, 
                            order_number INT NOT NULL, 
                            PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_90333E051E27F6BF ON public.answer (question_id)');
        $this->addSql('ALTER TABLE public.answer 
                            ADD CONSTRAINT FK_90333E051E27F6BF 
                            FOREIGN KEY (question_id) 
                            REFERENCES public.question (id) 
                            ON DELETE CASCADE');

        /** TABLE quiz_attempt */
        $this->addSql('CREATE TABLE public.quiz_attempt (
                            id INT GENERATED ALWAYS AS IDENTITY, 
                            quiz_id INT NOT NULL, 
                            attempt_number INT NOT NULL, 
                            attempt_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, 
                            earned_score DOUBLE PRECISION DEFAULT NULL, 
                            PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4AE5D2E2853CD175 ON public.quiz_attempt (quiz_id)');
        $this->addSql('ALTER TABLE public.quiz_attempt 
                            ADD CONSTRAINT FK_4AE5D2E2853CD175 
                            FOREIGN KEY (quiz_id) 
                            REFERENCES public.quiz (id) 
                            ON DELETE CASCADE');

        /** TABLE answer_to_question */
        $this->addSql('CREATE TABLE public.answer_to_question (
                            id INT GENERATED ALWAYS AS IDENTITY, 
                            question_id INT NOT NULL, 
                            answer_id INT DEFAULT NULL, 
                            quiz_attempt_id INT NOT NULL, 
                            text_answer VARCHAR(255) DEFAULT NULL, 
                            PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8EFD09111E27F6BF ON public.answer_to_question (question_id)');
        $this->addSql('CREATE INDEX IDX_8EFD0911AA334807 ON public.answer_to_question (answer_id)');
        $this->addSql('CREATE INDEX IDX_8EFD0911F8FE9957 ON public.answer_to_question (quiz_attempt_id)');
        $this->addSql('ALTER TABLE public.answer_to_question 
                            ADD CONSTRAINT FK_8EFD09111E27F6BF 
                            FOREIGN KEY (question_id) 
                            REFERENCES public.question (id) 
                            ON DELETE CASCADE');
        $this->addSql('ALTER TABLE public.answer_to_question 
                            ADD CONSTRAINT FK_8EFD0911AA334807 
                            FOREIGN KEY (answer_id) 
                            REFERENCES public.answer (id) 
                            ON DELETE CASCADE');
        $this->addSql('ALTER TABLE public.answer_to_question 
                            ADD CONSTRAINT FK_8EFD0911F8FE9957 
                            FOREIGN KEY (quiz_attempt_id) 
                            REFERENCES public.quiz_attempt (id) 
                            ON DELETE CASCADE');

    }

    public function down(Schema $schema): void
    {
        /** DROP FK CONSTRAINTS */
        $this->addSql('ALTER TABLE public.answer_to_question DROP CONSTRAINT FK_8EFD09111E27F6BF');
        $this->addSql('ALTER TABLE public.answer_to_question DROP CONSTRAINT FK_8EFD0911AA334807');
        $this->addSql('ALTER TABLE public.answer_to_question DROP CONSTRAINT FK_8EFD0911F8FE9957');
        $this->addSql('ALTER TABLE public.quiz_attempt DROP CONSTRAINT FK_4AE5D2E2853CD175');
        $this->addSql('ALTER TABLE public.answer DROP CONSTRAINT FK_90333E051E27F6BF');
        $this->addSql('ALTER TABLE public.question DROP CONSTRAINT FK_741B9227853CD175');

        /** DROP TABLES */
        $this->addSql('DROP TABLE public.answer_to_question');
        $this->addSql('DROP TABLE public.quiz_attempt');
        $this->addSql('DROP TABLE public.answer');
        $this->addSql('DROP TABLE public.question');
        $this->addSql('DROP TABLE public.quiz');

    }
}
