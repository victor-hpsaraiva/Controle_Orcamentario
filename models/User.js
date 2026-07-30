const users = [];

let nextUserId = 1;

module.exports = {

    create(
        name,
        email,
        password
    ){

        const user = {

            id: nextUserId++,
            name,
            email,
            password

        };

        users.push(user);

        return user;
    },

    findByEmail(email){

        return users.find(
            user =>
            user.email === email
        );
    }
};