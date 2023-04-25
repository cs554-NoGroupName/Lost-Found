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
};
