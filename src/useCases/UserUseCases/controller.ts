import { Request, Response } from 'express'
import { userUseCases } from './useCase'

export class UserController {


	constructor () {
	}

	async registerUser(req: Request, res: Response) {
		const { email, password } = req.body

		if (!email || !password) {
			res.status(400).json({msg: "email and password required"})
		}
		try {

			await userUseCases.registeUser({email, password}) 
			return res.status(201).json({msg: 'user created'})
		}
		catch (e: any) {
			if (e.status) {
				return res.status(e.status)
				.json(e.msg)
			}
			return res.status(500)
				.json(e.message || {msg: 'Unknow Error'})
		}
	}
	
	async loginWithEmail(req: Request, res: Response) {
		const { email, password } = req.body

		if (!email || !password) {
			res.status(400).json({msg: "email and password required"})
		}
		try {

			const token = await userUseCases.loginWithEmail({email, password}) 
			return res.status(201).json({token})
		}
		catch (e: any) {
			if (e.status) {
				return res.status(e.status)
				.json(e.msg)
			}
			return res.status(500)
				.json(e.message || {msg: 'Unknow Error'})
		}
	}
}


export const userController = new UserController()
