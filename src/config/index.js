const dotEnv = require('dotenv');

if(process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}`;
    dotEnv.config({ path: configFile });
} else {
    dotEnv.config()
}

module.exports = {
    PORT: process.env.PORT || 8000,
    DB_URL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb",
    APP_SECRET: process.env.APP_SECRET
}
