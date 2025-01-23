import { Request, Response, NextFunction } from 'express';

export function LoggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log('=============== LoggerMiddleware req ', req);
    next();
}
