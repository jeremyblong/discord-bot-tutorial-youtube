const { MongoClient } = require("mongodb");
const config = require("config");
const url = config.get("mongoURI");
const mongoose = require("mongoose");

class Connection {
    static async open () {
        if (this.db) {
            return this.db;
        }

        await mongoose.connect(url, { useNewUrlParser: true });

        this.db = await MongoClient.connect(this.url, this.options);

        console.log("This has been connected", this.db);

        return this.db;
    }
}

Connection.db = null;
Connection.url = url;
Connection.options = {
    useNewUrlParser: true
}

module.exports = { Connection };