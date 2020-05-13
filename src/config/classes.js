class Settings {
    constructor({ name, birthday, bio }) {
        if (name) { this.name = name }
        if (bio) { this.bio = bio }
        if (birthday) { this.birthday = birthday }
    }
    getData() {
        return this
    }
}

class User {
    constructor(obj) {
            this.obj = obj;
        }
        // Getter
    get data() {
        const user = this.obj;
        const userObject = {...user };
        delete userObject.password;

        return userObject;
    }
}

module.exports = {
    User,
    Settings
}