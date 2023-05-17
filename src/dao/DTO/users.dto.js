export default class UserDTO {

    constructor(user) {
        this.name = user.name
        this.lastName = user.lastName
        this.role = user.role
        this.email = user.email
        user.role=='premium' ? this.avatar = user.documents[0].reference: this.avatar ='' 
        
        
    }

}