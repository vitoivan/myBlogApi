import { IDatabase } from '../../database/'
import { Post } from '../../entities/Post'
import { database } from '../../database/'

type PostDTO = {
	title: string;
	post: string;
}

const formatDate = (date: string) => {

	const monthNames = ["Jan","Feb","Mar","Apr",
			"May","Jun","Jul","Aug",
			"Sep", "Oct","Nov","Dec"];

	// @ts-ignore
	return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()} - ${date.getHours()}h ${date.getMinutes()}min`
}

export class PostsUseCases {
	
	private db: IDatabase

	constructor (db: IDatabase) {
		this.db = db
	}

	async createPost (post: PostDTO) {
		const newPost = new Post(post)
		await this.db.createPost(newPost)
	}

	async getPosts (id?: string) {

		if (id)
		{
			const post = await this.db.getPostById(id)
			if (!post)
				throw { msg: "Post not found", status: 404 }

		// @ts-ignore
			const formatted = {...post, created_at: formatDate(post.created_at)}
			return formatted 
		}
		const posts = await this.db.getPosts()
		const formattedPosts = posts.map(post => {
			return {
				...post,
				// @ts-ignore
				created_at: formatDate(post.created_at)
			}
		})
		return formattedPosts 
	}

	async deleteOnePost (id: string) {
		const post = await this.db.deletePost(id) 
		if (!post.title)
			throw { msg: "Post not found", status: 404 }
		return post
	}

	async updateOnePost (id: string, {title, post}: PostDTO) {
		const newPost = new Post({title, post})
		const updatedPost = await this.db.updatePost(id, newPost) 
		if (!updatedPost.title)
			throw { msg: "Post not found", status: 404 }
		return updatedPost 
	}
} 

export const postsUseCases = new PostsUseCases(database.database)

