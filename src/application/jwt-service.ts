import {currentUser} from "./current-user";
const bcrypt = require('bcrypt');

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

    async generateSalt(saltNumber:number){
        return await bcrypt.genSalt(saltNumber)
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        if (hash) {
            return hash
        }
        return false
    },
}

