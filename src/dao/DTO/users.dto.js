export default class UserDTO {

    constructor(user) {
        this.name = user.name
        this.last_name = user.last_name
        this._id = user._id
        this.cartId = user.cartId
        
    }

}