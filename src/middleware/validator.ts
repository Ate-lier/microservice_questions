import { query, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateProductId = body('product_id')
  .notEmpty().withMessage('Product_id is required')
  .isInt({ min: 1 }).withMessage('Product_id should be an integer starting with 1')
  .toInt();


function errorHandler (req: Request, res: Response, next: NextFunction): any {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(err => err.msg) });
  }

  next();
}