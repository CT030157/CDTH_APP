class User {
    constructor(name, email, password, lastname, role = 0, cart = [], history = [], image, token, tokenExp) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.lastname = lastname;
        this.role = role;
        this.cart = cart;
        this.history = history;
        this.image = image;
        this.token = token;
        this.tokenExp = tokenExp;
    }
}

export default User;