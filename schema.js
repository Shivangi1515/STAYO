const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)

    }).required()

});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
            .messages({
                "any.required": "Rating is required",
                "number.base": "Rating must be a number",
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot be more than 5"
            }),
        comment: Joi.string().required()
    }).required()
})
