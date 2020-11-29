/**
 * Middleware layer for validating all customer related HTTP requests
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import {CustomerService} from './customers.service'
const jwt = require('jsonwebtoken')
const tokenPassword = process.env.TOKEN_PASSWORD;

@Injectable()
export class authMiddleware implements NestMiddleware {
  
    constructor(private readonly customerService: CustomerService){}

    /**
     * Verify on every customer HTTP request, if token is present and verified
     * @param req Headers: token
     * @param next If token is decoded
     */
    async use( req: Request,res: Response, next: Function ){
        try {
            let token = req.headers.token;
            if(token){
                this.customerService.verifyToken(token)
                .then(responseFromDb => {
                    if(responseFromDb.length === 0){
                        //Token dosent exist
                        console.log('Invalid token')
                        res.status(400).json({status: false, message: "Invalid token"})
                    }
                    else{
                        //token exists
                        console.log('Valid token')
                        var decoded = jwt.verify(token, tokenPassword);
                        if(decoded){
                            next();
                        }
                        else{
                            res.status(400).json({status: false, message: "Invalid token"})
                        }
                    }
                })
            }
            else{
                res.status(400).json({status: false, message: "Headers not present"})
            }
        }
        catch(err){
            return err
        }
    }
}

