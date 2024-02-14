import {currentUser} from "./current-user";

const jwt = require('jsonwebtoken')
export const jwtService = {
    async createJWT(userId: any) {

        return await jwt.sign({userId: userId}, process.env.JWT_SECRET, {expiresIn: '1h'})
    },
    async checkToken(token: string) {
        try {
            const result: any = await jwt.verify(token, process.env.JWT_SECRET);
            return result.userId
        } catch (error) {
            console.error('Ошибка при проверке токена:', error);
            return
        }
    },
}

