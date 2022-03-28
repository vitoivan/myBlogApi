import { Request, Response } from 'express'
import { postsUseCases } from './useCase'

export class PostsController {


	constructor () {
	}

	async createPost(req: Request, res: Response) {
		const { title, post } = req.body

		if (!title || !post) {
			return res.status(400).json({
				msg: "[title, post] keys are required"
			})
		}
		try {
			await postsUseCases.createPost({ title, post })	
			return res.status(201)
			.json({msg: 'post created'})

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
	
	async getPosts(req: Request, res: Response) {

		try {
			const posts = await postsUseCases.getPosts()
			return res.status(200)
			.json(posts)

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
	
	
	async getOnePost(req: Request, res: Response) {

		const { id } = req.params

		try {
			const posts = await postsUseCases.getPosts(id)
			return res.status(200)
			.json(posts)

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

	async deletePost(req: Request, res: Response) {
		
		const { postId } = req.body
		if (!postId)
			return res.status(400).json({
				msg: "postId required"
			})
		try {
			const post = await postsUseCases.deleteOnePost(postId)
			return res.status(200)
			.json(post)

		}
		catch (e: any) {
			if (e.status) {
				return res.status(e.status)
				.json({msg: e.msg})
			}
			return res.status(500)
				.json({msg: e.message || 'Unknow Error'})
		}
	}

	async updatePost(req: Request, res: Response) {
		
		const { postId, title, post } = req.body
		if (!postId || !title || !post)
			return res.status(400).json({
				msg: "keys [postId, title, post] required"
			})
		try {
			const updatedPost = await postsUseCases
				.updateOnePost(postId, {title, post})
			return res.status(200)
			.json(updatedPost)
		}
		catch (e: any) {
			if (e.status) {
				return res.status(e.status)
				.json({msg: e.msg})
			}
			return res.status(500)
				.json({msg: e.message || 'Unknow Error'})
		}
	}
}


export const postsController = new PostsController()
