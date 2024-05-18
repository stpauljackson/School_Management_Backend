exports.dateToStringIST = (date) => {
    return date.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}).split(', ')[0]
}