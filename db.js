const MongoClient = require("mongodb").MongoClient;

const mongo_uri = process.env.MONGO_URI;

let db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(mongo_uri);
    db = client.db("todo");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error(
      "Database is not connected. Call connectToDatabase() first."
    );
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
};
