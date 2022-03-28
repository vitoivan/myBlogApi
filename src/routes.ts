import express, { Router, Request, Response, NextFunction } from 'express'
import { postsController } from './useCases/PostUseCases/controller'
import { userController } from './useCases/UserUseCases/controller'
import { Token } from './middlewares/token'
import cors from 'cors'

const router = Router()

router.use(cors({
	origin: '*'
}))

router.post('/posts', Token.VerifyController, async (req: Request, resp: Response) => {
	return await postsController.createPost(req, resp)
})

router.get('/posts', async (req: Request, resp: Response) => {
	return await postsController.getPosts(req, resp)
})

router.get('/posts/:id', async (req: Request, resp: Response) => {
	return await postsController.getOnePost(req, resp)
})

router.delete('/posts', Token.VerifyController, async (req: Request, resp: Response) => {
	return await postsController.deletePost(req, resp)
})

router.put('/posts', Token.VerifyController, async (req: Request, resp: Response) => {
	return await postsController.updatePost(req, resp)
})

router.post('/users', async (req: Request, res: Response) => {
	return await userController.registerUser(req, res)
})

router.post('/users/login', async (req: Request, res: Response) => {
	return await userController.loginWithEmail(req, res)
})
export { router }
