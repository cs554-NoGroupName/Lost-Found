const notFoundError = (message = null) => {
  /**
   * This is a wrapper function
   * @param {string} message - The error message
   * @returns {object} The error object with status: 404
   */
  return {status: 404, message: message ?? "Resource not found"};
};

const unauthorizedError = (message = null) => {
  /**
   * This is a wrapper function
   * @param {string} message - The error message
   * @returns {object} The error object with status: 403
   */
  return {status: 403, message: message ?? "User not authorized / logged in"};
};

const badRequestError = (message = null) => {
  /**
   * This is a wrapper function
   * @param {string} message - The error message
   * @returns {object} The error object with status: 400
   */
  return {status: 400, message: message ?? "Incorrect input parameters"};
};

const internalServerError = (message = null) => {
  /**
   * This is a wrapper function
   * @param {string} message - The error message
   * @returns {object} The error object with status: 500
   */
  return {status: 500, message: message ?? "Internal Server Error"};
};

const checkId = (id, inputName) => {
  /**
   * This is a validation function
   * @param {string} id - The input string to validated as an id
   * @param {string} inputName - The name of the input variable
   * @throws {InvalidInput} - `The input ${inputName} does not exist` || `The input ${inputName} is an empty string` || `The input is not a valid Object ID` || `The input is not a valid Object ID`
   */
  if (!id || typeof id == "undefined") {
    throw `The input ${inputName} does not exist`;
  } else if (id.trim().length <= 0) {
    throw `The input ${inputName} is an empty string`;
  } else if (!ObjectId.isValid(id.trim())) {
    throw `The input is not a valid Object ID`;
  } else if (typeof id != "string") {
    throw `The input is not a valid Object ID`;
  }
};

export {
  notFoundError,
  unauthorizedError,
  badRequestError,
  internalServerError,
  checkId
};