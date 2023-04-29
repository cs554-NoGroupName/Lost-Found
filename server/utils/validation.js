import { ObjectId } from 'mongodb';
import xss from 'xss';
const checkInputString = (input, name) => {
  if (!input) {
    throw `You must provide a ${name}`;
  }
  if (typeof input !== 'string') {
    throw `${name} must be a string`;
  }
  input = input.trim();
  if (input.length === 0) {
    throw `${name} must not be empty`;
  }
  input = xss(input);
  return input;
};
const checkInputNumber = (input, name) => {
  if (isNaN(Number(input))) throw `${name} should be a number`;
};

const checkNames = (input, name) => {
  input = checkInputString(input, name);
  if (!/^[a-zA-Z ]+$/.test(input)) {
    throw `${name} must only contain letters`;
  }
  if (input.length < 4) throw `${name} should be of length 4 or greater`;
  return input;
};

const checkTitle = (input, name) => {
  input = checkInputString(input);
  if (input.length < 4) throw `${name} should be of length 4 or greater`; //added extra validation
  return input;
};

const checkEmail = (input) => {
  input = checkInputString(input, 'email');
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)) {
    throw 'Email must be a valid email address';
  }
  input = input.toLowerCase();
  return input;
};

const checkPhone = (input) => {
  input = checkInputString(input, 'phone');
  if (!/^[0-9]{10}$/.test(input)) {
    throw 'Phone number must be 10 digits';
  }
  return input;
};

const checkDate = (input) => {
  input = checkInputString(input, 'date');
  if (!/^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/.test(input)) {
    throw 'Date must be in the format MM/DD/YYYY';
  }
  return input;
};

const checkGender = (input) => {
  input = checkInputString(input, 'Gender');
  input = input.toLowerCase();
  if (!/^(male|female|non-binary|transgender|-)$/.test(input)) {
    throw 'Please select a valid Gender';
  }
  return input;
};

const checkObjectId = (input, name = 'object id') => {
  checkInputString(input, name);
  if (!ObjectId.isValid(input)) {
    throw `${name} must be a valid ObjectId`;
  }
  return input;
};
const checkPassword = (input) => {
  if (!input)
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  if (input === '')
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  if (input.length < 8)
    // return "Password must contain more than 8 and less than 20 characters!";
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';

  if (!/[0-9]/g.test(input))
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  // return "Password must contain atleast one number!";
  if (!/[A-Z]/g.test(input))
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  // return "Password must contain atleast one uppercase letter!";
  if (!/[a-z]/g.test(input))
    throw 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  // return "Password must contain atleast one lowercase letter!";
  return input;
};

export default {
  checkInputString,
  checkInputNumber,
  checkNames,
  checkTitle,
  checkEmail,
  checkPhone,
  checkDate,
  checkGender,
  checkObjectId,
  checkPassword,
};
