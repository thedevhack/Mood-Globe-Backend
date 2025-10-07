const { body } = require("express-validator");

const validateAddMoodBody = [
    body().custom((value, { req }) => {
        const allowedKeys = ["user_mood_value"];
        const extraKeys = Object.keys(req.body).filter(
            (key) => !allowedKeys.includes(key)
        );
        if (extraKeys.length > 0) {
            throw new Error(
                `Unexpected fields: ${extraKeys.join(", ")}. Only 'user_mood_value' is allowed.`
            );
        }
        return true;
    }),

    body("user_mood_value")
        .exists()
        .withMessage("'user_mood_value' is required.")
        .bail()

        .isNumeric()
        .withMessage("'user_mood_value' must be a number.")
        .bail()

        .isIn([-2, -1, 0, 1, 2])
        .withMessage("'user_mood_value' must be one of -2, -1, 0, 1, or 2."),
];

module.exports = {
    validateAddMoodBody,
};
