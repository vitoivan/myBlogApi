import { IDatabase } from '../../database/'
import { User } from '../../entities/User'
import { database } from '../../database/'

type userDTO = {
	email: string
	password: string
}

export class UserUseCases {
	
	private db: IDatabase

	constructor (db: IDatabase) {
		this.db = db
	}

	async registeUser (user: userDTO) {
		const newUser = new User(user)
		await this.db.registerUser(newUser)
	}


	async loginWithEmail (user: userDTO) {
		return await this.db.login(user.email, user.password)
	}
} 

export const userUseCases = new UserUseCases(database.database)

