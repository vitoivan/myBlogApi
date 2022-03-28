import { IDatabase } from '../'
import { Post } from '../../entities/Post'
import { User } from '../../entities/User'
import { MongoClient, ObjectID } from 'mongodb'
import bcrypt from 'bcrypt'
import { Token } from '../../middlewares/token'
import { config } from 'dotenv'

config()

export class MongoDB implements IDatabase {

	client?: MongoClient
	uri?: string = process.env.MONGO_URL 
	dbName?: string = "MyBlog"

	constructor () {}

	async connect() {
		
		if (this.client) 
			return this.client
		try {
			this.client = new MongoClient(this.uri || "")
			await this.client?.connect()
			await this.client?.db(this.dbName || "").command({ ping: 1 })
			return this.client
		} catch (e) {
			await this.close()
			return undefined
		}
	}

	async close() {
		await this.client?.close()
		this.client = undefined
	}
	
	async login(email: string, password: string) {

		const user = await this.getUserByEmail(email)		
		if (!user)
			throw { msg: "User not found", status: 404 }
		
		const isValid =  await bcrypt.compare(password, user.password)

		if (isValid)
			return await Token.sign(user._id.toString())
		return undefined
	
	}

	async createPost(post: Post) {
		const client = await this.connect()
		const postInserted = await client?.db(this.dbName || "").collection('posts')
		.insertOne(post)
		await this.close()
	}

	async deletePost(postId: string) {
		
		const client = await this.connect()
		const query = {
			_id: new ObjectID(postId)
		}
		const post = await client?.db(this.dbName || "")
			.collection<Post>('posts')
		.findOneAndDelete(query)

		await this.close()

		if (!post || post.value === null)
			return {} as Post

		return post.value as Post
	}

	async getPosts() {
		const client = await this.connect()
		const cursor = await client?.db(this.dbName || "").collection('posts')
		.find({})
		const posts = await cursor?.toArray() as Post[] | undefined
		this.close()
		if (!posts)
			return [] as Post[]
		return posts 
	}

	async updatePost(id: string, post: Post) {
		const query = {
			_id: new ObjectID(id),
		}
		const updateObject = {
			title: post.title,
			post: post.post,
			updated_at: post.updated_at,
		}
		const client = await this.connect()
		const updatedPost = await client?.db(this.dbName || "")
		.collection<Post>('posts')
		.findOneAndUpdate(query, {$set: updateObject})

		if (!updatedPost || updatedPost.value === null)
			return {} as Post
		
		await this.close()
		return updatedPost.value as Post 
	}

	async getPostById(id: string) {
		const client = await this.connect()

		const post = await client?.db(this.dbName || "")
		.collection<Post>('posts')
		.findOne({_id: new ObjectID(id)})

		await this.close()
		if (!post)
			return undefined
		return post 
	}

	async getUserById (id: string) {

		const client = await this.connect()

		const user = await client?.db(this.dbName || "")
		.collection<User>('users')
		.findOne({_id: new ObjectID(id)})

		await this.close()
		if (!user)
			return undefined
		return user 

	}

	async getUserByEmail (email: string) {

		const client = await this.connect()

		const user = await client?.db(this.dbName || "")
		.collection<User>('users')
		.findOne({email})

		await this.close()
		if (!user)
			return undefined
		return user 

	}

	async registerUser (user: User) {
		
		const client = await this.connect()

		const userInserted = await client?.db(this.dbName || "")
		.collection('users')
		.insertOne(user)

		await this.close()
	}

}
