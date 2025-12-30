const jwt = require('jsonwebtoken');

exports.generateActivationToken = (user) => {
    return jwt.sign(
        {
            uid: user._id,
            type: 'activation'
        },
        process.env.ACTIVATION_SECRET,
        { expiresIn: '15m' }
    );
};
