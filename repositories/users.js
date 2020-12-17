const fs = require('fs');
const crypto = require('crypto');

class UserRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (error) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // open file
        const records = await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        });
        return JSON.parse(records);
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        // write the updated 'records' array back to this.filename
        await this.writeAll(records);
    }
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), 'utf8');
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) throw new Error(`Record with id ${id} not found`);
        // Функция Object.assign получает список объектов и копирует в первый target свойства из остальных.
        // example START ***
        // let user = { name: "Вася" };
        // let visitor = { isAdmin: false, visits: true };
        // let admin = { isAdmin: true };
        // Object.assign(user, visitor, admin);
        // user <- visitor <- admin
        // alert(JSON.stringify(user)); // name: Вася, visits: true, isAdmin: true
        // example END ***
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for( let record of records ) {
            let found = true;
            for( let key in filters ) {
                if( record[key] !== filters[key] ) {
                    found = false;
                }
            }
            if(found) {
                return record;
            }
        }
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