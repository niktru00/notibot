const {mongoClient} = require('../config/dbConfig');
const ecdec = require('../encryptDecryptData');
const key = Buffer.from(process.env.twitch_key, 'base64');
const iv = Buffer.from(process.env.twitch_iv, 'base64');

async function save({access_token, refresh_token, token_type}) {
    try {
        const db = mongoClient.db("twitchdb");
        const tokenDB = db.collection("tokendb");
        const count = await tokenDB.countDocuments();
        let token = {token_type: token_type};
        token.access_token = ecdec.encrypt(access_token, key, 'utf8', iv);
        token.refresh_token = ecdec.encrypt(refresh_token, key, 'utf8', iv);
        const session = mongoClient.startSession();
        try {
            await session.withTransaction(async () => {
                if (count > 0) {
                    console.log('Try to delete data');
                    await tokenDB.deleteMany();
                }
                    await tokenDB.insertOne(token);

            })
        } finally {
            await session.endSession();
        }
    } catch (err) {
        console.log(err)
    } finally {
        // await mongoClient.close();
    }
}

async function read() {
    // try {
    const db = mongoClient.db("twitchdb");
    const tokenDB = db.collection("tokendb");
    const count = await tokenDB.countDocuments();
    if (count > 0) {
        const token = await tokenDB.findOne();
        token.access_token = ecdec.decrypt(token.access_token, key, 'utf8', iv);
        token.refresh_token = ecdec.decrypt(token.refresh_token, key, 'utf8', iv);
        return token;
        //   console.log(result);
    }
}



module.exports = {save, read};