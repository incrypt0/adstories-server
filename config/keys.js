module.exports = {
    // mongoURI:"mongodb+srv://incrypt0:Anand@2000@adstories.agqn0.mongodb.net/adstories?retryWrites=true&w=majority",
    mongoURI: "mongodb://localhost:27017/adstories" ||process.env.MONGO_URI || process.env.MONGO_DB_URI, 
} 