const generateToken = () => {
    const currentDateTime = new Date();

    const payload = {
        minute: currentDateTime.getMinutes(),
        hour: currentDateTime.getHours(),
        day: currentDateTime.getDate(),
        month: currentDateTime.getMonth() + 1,
        year: currentDateTime.getFullYear(),
    };

    const generatedToken = payload.year + payload.month + payload.day + payload.hour + payload.minute + 'iloveyou'

    return btoa(generatedToken.toString()).replace('E', 'x').replace('A', 'm')
};

export default generateToken
