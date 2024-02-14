import {
    authLoginOrEmailValidation,
    usersPasswordValidation
} from "../../users/validation/users-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";

const authValidators = [
    usersPasswordValidation,
    authLoginOrEmailValidation,
    inputValidationMiddleware,
]
import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {authService} from "../auth-domain/auth-service";
import {AuthType} from "../auth-types/auth-types";
import {jwtService} from "../../application/jwt-service";
import {currentUser} from "../../application/current-user";
import {usersService} from "../../users/domain/users-service";
import {usersQueryRepository} from "../../users/query-repository/users-query-repository";
import {ObjectId} from "mongodb";
import {authRepositories} from "../auth-repository/auth-repository";
import {usersValidators} from "../../users/router/users-router";
import {UserCreateType} from "../../users/types/user-types";

export const authRouter = Router({})


authRouter.get('/me',
    async (req: Request, res: Response) => {
        try {
            let t = req.headers.authorization!.split(' ')[1]
            const userId = await jwtService.checkToken(t)
            const getUserByID = await usersQueryRepository.getUserById(new ObjectId(userId))
            if(getUserByID){
                currentUser.userLogin = getUserByID.login
                currentUser.userId = userId
                res.send({
                    "email": getUserByID.email,
                    "login": getUserByID.login,
                    "userId": getUserByID.id
                })
                return

            }else{
                res.sendStatus(401)
                return

            }
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

authRouter.post('/login',
    async (req: Request, res: Response) => {
        try {
            const authData: AuthType = {
                loginOrEmail: req.body.loginOrEmail,
                password: req.body.password,
            }
            const response = await authService.authUser(authData)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
                return
            }
            const user = await authRepositories.getUserIdByAutData(authData)
            if(user){

                const token = await jwtService.createJWT(user._id)
                res.send({accessToken: token})

            }
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })

authRouter.post('/registration',
    usersValidators,
    async (req: Request, res: Response) => {
        // try {
        //     const user: UserCreateType = {
        //     login: req.body.login,
        //     email: req.body.email,
        //     password: req.body.password,
        //     createdAt: new Date().toISOString(),
        // }
        //     const response = await authService.authUser(user)
        //     if (!response) {
        //         res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
        //         return
        //     }
        //     const user = await authRepositories.getUserIdByAutData(authData)
        //     if(user){
        //
        //         const token = await jwtService.createJWT(user._id)
        //         res.send({accessToken: token})
        //     }
        // } catch (error) {
        //     res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        // }

    })



