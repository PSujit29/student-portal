const rateLimit = require('express-rate-limit');

// Define the limiter rule
const onboardingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 10, // Limit each IP to 10 requests per window
    message: 'Too many onboarding attempts, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {onboardingLimiter};