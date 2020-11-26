const jwt = require("jsonwebtoken");
const config = require("../config/CONSTANTS.json");

module.exports = {
    sign: (userId, time = '24h') => {
        const token = jwt.sign({ userId: userId }, config.MY_SECRET,  {expiresIn: time});
        return token;
    },
    verify: async (token) => {
        return await jwt.verify(token, config.MY_SECRET, async (err, payload) => {
            if (err) {
              return {status: "fail", errorcode: "422", error_message: "you must be logged in"};
            }
            return {status: "success", data: payload};
        });
    }
}
