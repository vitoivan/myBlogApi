import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { MongoDB } from './mongodb'

export interface IDatabase {
	// General
	connect: () => void 
	close: () => void 
	// Posts
	createPost: (post: Post) => Promise<void> 
	deletePost: (id: string) => Promise<Post>	
	getPosts: () => Promise<Post[]>
	updatePost: (id: string, post: Post) => Promise<Post> 
	getPostById: (id: string) => Promise<Post|undefined>
	// User
	getUserById: (id: string) => Promise<User|undefined>
	getUserByEmail: (email: string) => Promise<User|undefined>
	registerUser: (user: User) => Promise<void>
	login: (email: string, password: string) => Promise<string | undefined> 
}


class DB {
	
	database: IDatabase

	constructor (db: IDatabase) {
		this.database = db
	}
}


const mongoDatabase = new MongoDB()
export const database = new DB(mongoDatabase)
