import httpStatus from 'http-status';
import APIError from './APIError';
import { error } from 'util';

/**
   * Return new validation error
   *
   * @param {Error} errorData
   * @returns {Error|APIError}
   */
const generateError = (errorData) => {
    const errorsArray = [];

    if (errorData.code === 11000) {
        // duplicate issue
        errorsArray.push({
            field: '',
            location: 'body',
            messages: ['Already Exists'],
        });

    } else {
        let { errors } = errorData;
        for (let err in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, err)) {
                let data = {
                    field: err,
                    location: 'body',
                    messages: [errors[err].message],
                }
                errorsArray.push(data);
            }
        }
    }

    return new APIError({
        message: errorData.message || 'Validation Error',
        errors: errorsArray,
        status: errorData.code === 11000 ? httpStatus.CONFLICT : httpStatus.BAD_REQUEST,
        isPublic: true,
        stack: errorData.stack,
    });
};

exports.generateError = generateError;