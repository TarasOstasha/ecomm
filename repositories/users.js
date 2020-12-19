const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
    async create(attrs) {
        // attrs === { email: '', password: '' }
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        // write the updated 'records' array back to this.filename
        await this.writeAll(records);
        return record;
    }

    async comparePasswords(saved, supplied) {
        // Saved -> password saved in our database. 'hashed.salt'
        // Supplied -> password given to us by a user trying to sign in
        const [hashed, salt] = saved.split('.');
        // OR (the same method)
        //const result = saved.split('.');
        //const hashed = result[0];
        //const salt = result[1];
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');

    }

}

module.exports = new UserRepository('users.json');

// const test = async () => {
//     try {
//         const repo = new UserRepository('users.json');
//         //await repo.create({ email: 'test@test.com', password: '123' });
//         //const user = await repo.getOne('dsfdsf');
//         //await repo.delete('7174c09a');
//         //await repo.update('165de19a', { password: 'password' });
//         const user = await repo.getOneBy({ email: "test@test.com", password: 'password' });
//         console.log(user);
//     } catch (error) {
//         console.log(error);
//     }

// }
// test();