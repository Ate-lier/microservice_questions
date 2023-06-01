import { query, body, check, ValidationError, validationResult } from 'express-validator';
import { HttpError } from './error';
import { Request, Response, NextFunction } from 'express';

function errorFormatter(error: ValidationError) {
  return {
    type: 'Validation',
    message: error.msg
  };
}

// Validation middleware
function ultimateValidator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array(), 400));
  } else {
    next();
  }
}

function idValidator(idField: string) {
  return check(idField)
    .notEmpty()
    .withMessage(`${idField} is required`)
    .isInt({ min: 1 })
    .withMessage(`${idField} must be an integer larger than 1`)
    .toInt();
}

function sortByValidator() {
  return query('sortBy')
    .optional()
    .isIn(['helpful', 'date_written'])
    .withMessage("SortBy must be either 'helpful' or 'date_written'")
}

// may refactor later when client-side needs
function bodyValidator() {
  return body('body')
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ min: 10, max: 255 })
    .withMessage('Body must contain characters of length from 10 to 255, inclusively');
}

function emailValidator(emailField: string) {
  return body(emailField)
    .notEmpty()
    .withMessage(`${emailField} is required`)
    .isEmail()
    .withMessage(`${emailField} must be a valid email format`)
    .isLength({ max: 255 })
    .withMessage(`${emailField} must contains less than 256 characters`);
}

// might refactor to username later
function nameValidator(nameField: string) {
  return body(nameField)
    .notEmpty()
    .withMessage(`${nameField} is required`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`${nameField} must contain characters of length from 3 to 255, inclusively`);
}

function currentPageValidator() {
  return query('currentPage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Current page must be a positive integer.')
}

function pageLimitValidator() {
  return query('pageLimit')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Page limit must be a positive integer')
}


// QUESTION ROUTE
export const postQuestionValidation = [
  idValidator('product_id'),
  bodyValidator(),
  nameValidator('asker_name'),
  emailValidator('asker_email'),
  ultimateValidator
];

export const getQuestionsValidation = [
  idValidator('product_id'),
  sortByValidator(),
  currentPageValidator(),
  pageLimitValidator(),
  ultimateValidator
];

export const deleteQuestionValidation = [
  idValidator('question_id'),
  ultimateValidator
];

export const likeQuestionValidation = [
  idValidator('question_id'),
  ultimateValidator
];

export const unlikeQuestionValidation = [
  idValidator('question_id'),
  ultimateValidator
];

export const reportQuestionValidation = [
  idValidator('question_id'),
  ultimateValidator
];



// ANSWER ROUTE
export const postAnswerValidation = [
  idValidator('question_id'),
  bodyValidator(),
  nameValidator('answerer_name'),
  emailValidator('answerer_email'),
  ultimateValidator
];

export const getAnswersValidation = [
  idValidator('question_id'),
  sortByValidator(),
  currentPageValidator(),
  pageLimitValidator(),
  ultimateValidator
];

export const deleteAnswerValidation = [
  idValidator('answer_id'),
  ultimateValidator
];

export const likeAnswerValidation = [
  idValidator('answer_id'),
  ultimateValidator
];

export const unlikeAnswerValidation = [
  idValidator('answer_id'),
  ultimateValidator
];

export const reportAnswerValidation = [
  idValidator('answer_id'),
  ultimateValidator
];