import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { database } from '../database'
import { config } from 'dotenv'

config()

type TokenPayload = {
	data : {
		userID: string;
	}
}


const privateKey = process.env.TOKEN_PK || "Super private key"

export class Token {

	static async verify (token: string) {
		const decoded = await jwt.verify(token, privateKey)
		return (decoded as TokenPayload).data.userID 
	}
	
	static async sign(userID: string) {
		const now = Date.now() / 1000  // In seconds
		const oneDay = (60 * 60 * 24) 
		const exp = Math.floor(now + (oneDay * 7))

		const payload = {
			data: { userID},
			exp	
		}
		const token = await jwt.sign(payload, privateKey)

		return token
	}
	static async VerifyController (
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const header = req.headers.authorization

		try {
			if (!header)
				return res.status(401).send({msg: "Bad credentials"})
			
			const [bearer, token] = header.split(' ')

			if (!bearer || bearer !== "Bearer")
				return res.status(401).send({msg: "Bad credentials"})

			if (!token)
				return res.status(401).send({msg: "Bad credentials"})
			else {
				const userID = await Token.verify(token)
				const db = database.database							
				const user = await db.getUserById(userID)
				if (!user)
					return res.status(401).send({msg: "Bad credentials"})
				next()
			}
		} catch (e: any) {
			const data = {msg: e.message || 'Bad credentials'}
			return res.status(400).json(data)
		}
	}
}
