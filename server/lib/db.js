let _ = class DB {

    static localStorage = [];

    static save(data) {
        if(data) {
            this.localStorage.push(data);
            return data;
        }
        return false;
    }

    static findAll() {

    }


    static findByUserName(username) {
        if(username) {
            for(let rec of this.localStorage) {
                if(rec.username === username) {
                    return rec;
                }
            }
        }
        return false;
    }
    static findById(id) {
        if(id) {
            for(let rec  of this.localStorage ) {
                if(rec.id === id) {
                    return rec;
                }
            }
        }
        return false;
    }

    static delete(id) {
        if(id) {
            for(let rec of this.localStorage) {
                if(rec.id === id) {

                }
            }
        }
        return false;

    }

    static update(user) {

    }
}

module.exports = _;