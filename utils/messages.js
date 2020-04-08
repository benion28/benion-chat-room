const moment = require("moment");

formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format("HH:mm")
    }
};

// // 12 Hours Formats
// time: moment().format("hh:mm a")
// time: moment().format("h:mm a")

// // 24 Hours Formats
// time: moment().format("HH:mm")
// time: moment().format("H:mm")

module.exports = formatMessage;