//Create and send token and save in cookie


const sendToken = (user, statusCode, res) => {
    //create JWT token
    const token = user.getJwtToken();

    //option for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    // if (process.env.NODE_ENV === 'production') {
    //     options.secure = true;
    // }
    res.status(statusCode).cookie('token', token, options)
        .json({
            success: true,
            token: token
        })
}

module.exports = sendToken;