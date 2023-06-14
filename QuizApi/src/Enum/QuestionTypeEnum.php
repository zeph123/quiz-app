<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * Class QuestionTypeEnum
 *
 * @author Zygmunt Łata
 * @package App\Enum
 */
class QuestionTypeEnum
{
    public const TYPE_QUESTION_TEXT = 1;
    public const TYPE_QUESTION_SINGLE_CHOICE = 2;
    public const TYPE_QUESTION_MULTIPLE_CHOICE = 3;
}