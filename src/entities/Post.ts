
export class Post {

	title: string;
	post: string;
	created_at?: Date = new Date()
	updated_at?: Date = new Date() 

	constructor (props: Post) {
		this.title = props.title
		this.post = props.post
		this.created_at = props.created_at || this.created_at
		this.updated_at = props.updated_at || this.updated_at

	}
}
