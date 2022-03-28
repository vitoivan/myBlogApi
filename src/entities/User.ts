import bcrypt from 'bcrypt'


type userDTO = {
	email: string
	password: string
}
export class User {

	email: string;
	// @ts-ignore
	password: string;
	created_at?: Date = new Date()
	updated_at?: Date = new Date() 

	constructor (props: userDTO) {
		this.email = props.email
		this.setPassword(props.password)
	}
	
	
	setPassword(password: string) {
		const self = this
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) return;
			self.password = hash
		})
	}
}
