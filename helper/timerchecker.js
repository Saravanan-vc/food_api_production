function checkTime(startTime, endTime, currentTime) {
    
function convertTO24(formatTime) {
    const match = formatTime.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!match) {
        throw new Error(`Invalid time format: ${formatTime}`);
    }

    let [_, hours, minute, period] = match;
    let hours24 = parseInt(hours);

    if (period.toLowerCase() === "pm" && hours24 !== 12) {
        hours24 += 12;
    } else if (period.toLowerCase() === "am" && hours24 === 12) {
        hours24 = 0; 
    }

    return hours24 * 60 + parseInt(minute); 
}
    const convertStartT = convertTO24(startTime);
    const convertEndT = convertTO24(endTime);
    const convertTime = convertTO24(currentTime);

    if (convertStartT <= convertTime && convertEndT >= convertTime) {

        return true;
    }

    return false;
}


module.exports = checkTime;
