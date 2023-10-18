const mongoose = require('mongoose')

const connectToMongo = async () => {
    try{
    const conn = await mongoose.connect(process.env.mongoURI)
    console.log('mongodb connected successfully')
    }catch(error){
        console.log(`mongo connection failed ${error}`)
    }
}

module.exports = connectToMongo;