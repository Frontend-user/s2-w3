import {ObjectId} from "mongodb";
import {usersRepositories} from "../repository/users-repository";
import {UserCreateType, UserEmailEntityType, UserHashType, UserInputModelType, UserViewType} from "../types/user-types";
import {usersQueryRepository} from "../query-repository/users-query-repository";

const bcrypt = require('bcrypt');


export const usersService = {
    async createUser(user: UserInputModelType, isReqFromSuperAdmin: boolean): Promise<ObjectId | false> {
        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this.__generateHash(user.password, passwordSalt)

        let changeUserData: any = {...user}
        delete changeUserData.password
        if(isReqFromSuperAdmin){
         const  userEmailEntity: UserEmailEntityType  =  {
                accountData: {
                    login: changeUserData.login,
                    email: changeUserData.email,
                    createdAt:   new Date().toISOString(),
                },
                passwordSalt,
                passwordHash,
                emailConfirmation:{
                    confirmationCode: 'superadmin',
                    expirationDate: 'superadmin'
                },
                isConfirmed: isReqFromSuperAdmin
            }
            const userId = await usersRepositories.createUser(userEmailEntity)
            if (!userId) {
                return false
            }
            return userId
        }

        const  userEmailEntity: UserEmailEntityType  =  {
            accountData: {
                login: changeUserData.login,
                email: changeUserData.email,
                createdAt:   new Date().toISOString(),

            },
            passwordSalt,
            passwordHash,
            emailConfirmation:{
                confirmationCode: 'notsuperadmin',
                expirationDate: 'notsuperadmin'
            },
            isConfirmed: false
        }
        const userId = await usersRepositories.createUser(userEmailEntity)
        if (!userId) {
            return false
        }
        return userId


    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        return await usersRepositories.deleteUser(id)

    },

    async __generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        if (hash) {
            return hash
        }
        return false
    },

}