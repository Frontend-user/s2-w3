import {
    authLoginOrEmailValidation, checkCodeConfirmation, checkCodeExist, checkEmailConfirmation,
    userEmailExistValidation, userEmailRecendingExistValidation,
    userLoginExistValidation,
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation
} from "../../users/validation/users-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";
export const registrationValidators = [
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    userEmailExistValidation,
    userLoginExistValidation,
    inputValidationMiddleware,
]
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
import {authorizationMiddleware} from "../../validation/auth-validation";

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
    ...registrationValidators,
    async (req: Request, res: Response) => {
    try {

    const userInputData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
    }
        const response = await authService.registration(userInputData)

        if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }
        res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })



authRouter.post('/registration-confirmation',
    checkCodeConfirmation,
    checkCodeExist,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {

            const response = await authService.registrationConfirm(req.body.code)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

authRouter.post('/registration-email-resending',
    checkEmailConfirmation,
    userEmailRecendingExistValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {

            const response = await authService.registrationEmailResending(req.body.email)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

