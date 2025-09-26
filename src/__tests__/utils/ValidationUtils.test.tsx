import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { validateEmail, validateUrl, validatePhone, validatePassword, validateUUID, validateJSON, validateDate, validateNumber, validateString, validateArray, validateObject, validateBoolean, validateFunction, validateRegExp, validateError, validatePromise, validateSymbol, validateBigInt, validateNull, validateUndefined, validateNaN, validateInfinity, validateFinite, validateInteger, validateFloat, validatePositive, validateNegative, validateZero, validateNonZero, validateEven, validateOdd, validatePrime, validateComposite, validatePerfect, validateAbundant, validateDeficient, validateTriangular, validateSquare, validateCubic, validateFibonacci, validateLucas, validatePell, validatePellLucas, validateJacobsthal, validateJacobsthalLucas, validatePadovan, validatePerrin, validateTribonacci, validateTetranacci, validatePentanacci, validateHexanacci, validateHeptanacci, validateOctanacci, validateNonanacci, validateDecanacci } from '../../utils';

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('validates correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('https://www.example.com/path')).toBe(true);
      expect(validateUrl('https://example.com:8080/path?query=value')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(validateUrl('invalid-url')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(null)).toBe(false);
      expect(validateUrl(undefined)).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
      expect(validatePhone('123.456.7890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('invalid-phone')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone(null)).toBe(false);
      expect(validatePhone(undefined)).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('validates strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
      expect(validatePassword('MyStr0ng#Pass')).toBe(true);
      expect(validatePassword('ComplexP@ssw0rd')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
    });
  });

  describe('UUID Validation', () => {
    it('validates correct UUIDs', () => {
      expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(validateUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(validateUUID('6ba7b811-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('rejects invalid UUIDs', () => {
      expect(validateUUID('invalid-uuid')).toBe(false);
      expect(validateUUID('550e8400-e29b-41d4-a716')).toBe(false);
      expect(validateUUID('')).toBe(false);
      expect(validateUUID(null)).toBe(false);
      expect(validateUUID(undefined)).toBe(false);
    });
  });

  describe('JSON Validation', () => {
    it('validates correct JSON', () => {
      expect(validateJSON('{"key": "value"}')).toBe(true);
      expect(validateJSON('[1, 2, 3]')).toBe(true);
      expect(validateJSON('true')).toBe(true);
      expect(validateJSON('null')).toBe(true);
    });

    it('rejects invalid JSON', () => {
      expect(validateJSON('invalid-json')).toBe(false);
      expect(validateJSON('{key: value}')).toBe(false);
      expect(validateJSON('')).toBe(false);
      expect(validateJSON(null)).toBe(false);
      expect(validateJSON(undefined)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('validates correct dates', () => {
      expect(validateDate('2024-01-17')).toBe(true);
      expect(validateDate('01/17/2024')).toBe(true);
      expect(validateDate('January 17, 2024')).toBe(true);
    });

    it('rejects invalid dates', () => {
      expect(validateDate('invalid-date')).toBe(false);
      expect(validateDate('32/01/2024')).toBe(false);
      expect(validateDate('')).toBe(false);
      expect(validateDate(null)).toBe(false);
      expect(validateDate(undefined)).toBe(false);
    });
  });

  describe('Number Validation', () => {
    it('validates correct numbers', () => {
      expect(validateNumber(123)).toBe(true);
      expect(validateNumber(123.45)).toBe(true);
      expect(validateNumber(-123)).toBe(true);
      expect(validateNumber(0)).toBe(true);
    });

    it('rejects invalid numbers', () => {
      expect(validateNumber('not-a-number')).toBe(false);
      expect(validateNumber(NaN)).toBe(false);
      expect(validateNumber(Infinity)).toBe(false);
      expect(validateNumber(null)).toBe(false);
      expect(validateNumber(undefined)).toBe(false);
    });
  });

  describe('String Validation', () => {
    it('validates correct strings', () => {
      expect(validateString('hello')).toBe(true);
      expect(validateString('')).toBe(true);
      expect(validateString('123')).toBe(true);
    });

    it('rejects invalid strings', () => {
      expect(validateString(123)).toBe(false);
      expect(validateString(null)).toBe(false);
      expect(validateString(undefined)).toBe(false);
    });
  });

  describe('Array Validation', () => {
    it('validates correct arrays', () => {
      expect(validateArray([1, 2, 3])).toBe(true);
      expect(validateArray([])).toBe(true);
      expect(validateArray(['a', 'b', 'c'])).toBe(true);
    });

    it('rejects invalid arrays', () => {
      expect(validateArray('not-an-array')).toBe(false);
      expect(validateArray(null)).toBe(false);
      expect(validateArray(undefined)).toBe(false);
    });
  });

  describe('Object Validation', () => {
    it('validates correct objects', () => {
      expect(validateObject({})).toBe(true);
      expect(validateObject({ key: 'value' })).toBe(true);
      expect(validateObject(new Date())).toBe(true);
    });

    it('rejects invalid objects', () => {
      expect(validateObject('not-an-object')).toBe(false);
      expect(validateObject(null)).toBe(false);
      expect(validateObject(undefined)).toBe(false);
    });
  });

  describe('Boolean Validation', () => {
    it('validates correct booleans', () => {
      expect(validateBoolean(true)).toBe(true);
      expect(validateBoolean(false)).toBe(true);
    });

    it('rejects invalid booleans', () => {
      expect(validateBoolean('true')).toBe(false);
      expect(validateBoolean(1)).toBe(false);
      expect(validateBoolean(null)).toBe(false);
      expect(validateBoolean(undefined)).toBe(false);
    });
  });

  describe('Function Validation', () => {
    it('validates correct functions', () => {
      expect(validateFunction(() => {})).toBe(true);
      expect(validateFunction(function() {})).toBe(true);
      expect(validateFunction(Array)).toBe(true);
    });

    it('rejects invalid functions', () => {
      expect(validateFunction('not-a-function')).toBe(false);
      expect(validateFunction(null)).toBe(false);
      expect(validateFunction(undefined)).toBe(false);
    });
  });

  describe('RegExp Validation', () => {
    it('validates correct RegExp', () => {
      expect(validateRegExp(/test/)).toBe(true);
      expect(validateRegExp(new RegExp('test'))).toBe(true);
    });

    it('rejects invalid RegExp', () => {
      expect(validateRegExp('not-a-regexp')).toBe(false);
      expect(validateRegExp(null)).toBe(false);
      expect(validateRegExp(undefined)).toBe(false);
    });
  });

  describe('Error Validation', () => {
    it('validates correct errors', () => {
      expect(validateError(new Error())).toBe(true);
      expect(validateError(new TypeError())).toBe(true);
      expect(validateError(new ReferenceError())).toBe(true);
    });

    it('rejects invalid errors', () => {
      expect(validateError('not-an-error')).toBe(false);
      expect(validateError(null)).toBe(false);
      expect(validateError(undefined)).toBe(false);
    });
  });

  describe('Promise Validation', () => {
    it('validates correct promises', () => {
      expect(validatePromise(Promise.resolve())).toBe(true);
      expect(validatePromise(Promise.reject())).toBe(true);
      expect(validatePromise(new Promise(() => {}))).toBe(true);
    });

    it('rejects invalid promises', () => {
      expect(validatePromise('not-a-promise')).toBe(false);
      expect(validatePromise(null)).toBe(false);
      expect(validatePromise(undefined)).toBe(false);
    });
  });

  describe('Symbol Validation', () => {
    it('validates correct symbols', () => {
      expect(validateSymbol(Symbol())).toBe(true);
      expect(validateSymbol(Symbol('test'))).toBe(true);
      expect(validateSymbol(Symbol.for('test'))).toBe(true);
    });

    it('rejects invalid symbols', () => {
      expect(validateSymbol('not-a-symbol')).toBe(false);
      expect(validateSymbol(null)).toBe(false);
      expect(validateSymbol(undefined)).toBe(false);
    });
  });

  describe('BigInt Validation', () => {
    it('validates correct BigInts', () => {
      expect(validateBigInt(BigInt(123))).toBe(true);
      expect(validateBigInt(BigInt('123'))).toBe(true);
    });

    it('rejects invalid BigInts', () => {
      expect(validateBigInt('not-a-bigint')).toBe(false);
      expect(validateBigInt(null)).toBe(false);
      expect(validateBigInt(undefined)).toBe(false);
    });
  });

  describe('Null Validation', () => {
    it('validates null', () => {
      expect(validateNull(null)).toBe(true);
    });

    it('rejects non-null values', () => {
      expect(validateNull(undefined)).toBe(false);
      expect(validateNull('')).toBe(false);
      expect(validateNull(0)).toBe(false);
    });
  });

  describe('Undefined Validation', () => {
    it('validates undefined', () => {
      expect(validateUndefined(undefined)).toBe(true);
    });

    it('rejects non-undefined values', () => {
      expect(validateUndefined(null)).toBe(false);
      expect(validateUndefined('')).toBe(false);
      expect(validateUndefined(0)).toBe(false);
    });
  });

  describe('NaN Validation', () => {
    it('validates NaN', () => {
      expect(validateNaN(NaN)).toBe(true);
    });

    it('rejects non-NaN values', () => {
      expect(validateNaN(123)).toBe(false);
      expect(validateNaN('123')).toBe(false);
      expect(validateNaN(null)).toBe(false);
    });
  });

  describe('Infinity Validation', () => {
    it('validates Infinity', () => {
      expect(validateInfinity(Infinity)).toBe(true);
      expect(validateInfinity(-Infinity)).toBe(true);
    });

    it('rejects non-Infinity values', () => {
      expect(validateInfinity(123)).toBe(false);
      expect(validateInfinity('123')).toBe(false);
      expect(validateInfinity(null)).toBe(false);
    });
  });

  describe('Finite Validation', () => {
    it('validates finite numbers', () => {
      expect(validateFinite(123)).toBe(true);
      expect(validateFinite(123.45)).toBe(true);
      expect(validateFinite(-123)).toBe(true);
    });

    it('rejects non-finite values', () => {
      expect(validateFinite(Infinity)).toBe(false);
      expect(validateFinite(-Infinity)).toBe(false);
      expect(validateFinite(NaN)).toBe(false);
    });
  });

  describe('Integer Validation', () => {
    it('validates integers', () => {
      expect(validateInteger(123)).toBe(true);
      expect(validateInteger(-123)).toBe(true);
      expect(validateInteger(0)).toBe(true);
    });

    it('rejects non-integers', () => {
      expect(validateInteger(123.45)).toBe(false);
      expect(validateInteger('123')).toBe(false);
      expect(validateInteger(null)).toBe(false);
    });
  });

  describe('Float Validation', () => {
    it('validates floats', () => {
      expect(validateFloat(123.45)).toBe(true);
      expect(validateFloat(-123.45)).toBe(true);
      expect(validateFloat(0.0)).toBe(true);
    });

    it('rejects non-floats', () => {
      expect(validateFloat(123)).toBe(false);
      expect(validateFloat('123.45')).toBe(false);
      expect(validateFloat(null)).toBe(false);
    });
  });

  describe('Positive Validation', () => {
    it('validates positive numbers', () => {
      expect(validatePositive(123)).toBe(true);
      expect(validatePositive(123.45)).toBe(true);
      expect(validatePositive(0.1)).toBe(true);
    });

    it('rejects non-positive numbers', () => {
      expect(validatePositive(-123)).toBe(false);
      expect(validatePositive(0)).toBe(false);
      expect(validatePositive('123')).toBe(false);
    });
  });

  describe('Negative Validation', () => {
    it('validates negative numbers', () => {
      expect(validateNegative(-123)).toBe(true);
      expect(validateNegative(-123.45)).toBe(true);
      expect(validateNegative(-0.1)).toBe(true);
    });

    it('rejects non-negative numbers', () => {
      expect(validateNegative(123)).toBe(false);
      expect(validateNegative(0)).toBe(false);
      expect(validateNegative('123')).toBe(false);
    });
  });

  describe('Zero Validation', () => {
    it('validates zero', () => {
      expect(validateZero(0)).toBe(true);
      expect(validateZero(0.0)).toBe(true);
    });

    it('rejects non-zero values', () => {
      expect(validateZero(123)).toBe(false);
      expect(validateZero(-123)).toBe(false);
      expect(validateZero('0')).toBe(false);
    });
  });

  describe('Non-Zero Validation', () => {
    it('validates non-zero numbers', () => {
      expect(validateNonZero(123)).toBe(true);
      expect(validateNonZero(-123)).toBe(true);
      expect(validateNonZero(123.45)).toBe(true);
    });

    it('rejects zero', () => {
      expect(validateNonZero(0)).toBe(false);
      expect(validateNonZero(0.0)).toBe(false);
    });
  });

  describe('Even Validation', () => {
    it('validates even numbers', () => {
      expect(validateEven(2)).toBe(true);
      expect(validateEven(4)).toBe(true);
      expect(validateEven(6)).toBe(true);
    });

    it('rejects odd numbers', () => {
      expect(validateEven(1)).toBe(false);
      expect(validateEven(3)).toBe(false);
      expect(validateEven(5)).toBe(false);
    });
  });

  describe('Odd Validation', () => {
    it('validates odd numbers', () => {
      expect(validateOdd(1)).toBe(true);
      expect(validateOdd(3)).toBe(true);
      expect(validateOdd(5)).toBe(true);
    });

    it('rejects even numbers', () => {
      expect(validateOdd(2)).toBe(false);
      expect(validateOdd(4)).toBe(false);
      expect(validateOdd(6)).toBe(false);
    });
  });

  describe('Prime Validation', () => {
    it('validates prime numbers', () => {
      expect(validatePrime(2)).toBe(true);
      expect(validatePrime(3)).toBe(true);
      expect(validatePrime(5)).toBe(true);
      expect(validatePrime(7)).toBe(true);
    });

    it('rejects non-prime numbers', () => {
      expect(validatePrime(1)).toBe(false);
      expect(validatePrime(4)).toBe(false);
      expect(validatePrime(6)).toBe(false);
      expect(validatePrime(8)).toBe(false);
    });
  });

  describe('Composite Validation', () => {
    it('validates composite numbers', () => {
      expect(validateComposite(4)).toBe(true);
      expect(validateComposite(6)).toBe(true);
      expect(validateComposite(8)).toBe(true);
      expect(validateComposite(9)).toBe(true);
    });

    it('rejects non-composite numbers', () => {
      expect(validateComposite(1)).toBe(false);
      expect(validateComposite(2)).toBe(false);
      expect(validateComposite(3)).toBe(false);
      expect(validateComposite(5)).toBe(false);
    });
  });

  describe('Perfect Validation', () => {
    it('validates perfect numbers', () => {
      expect(validatePerfect(6)).toBe(true);
      expect(validatePerfect(28)).toBe(true);
      expect(validatePerfect(496)).toBe(true);
    });

    it('rejects non-perfect numbers', () => {
      expect(validatePerfect(1)).toBe(false);
      expect(validatePerfect(2)).toBe(false);
      expect(validatePerfect(3)).toBe(false);
      expect(validatePerfect(4)).toBe(false);
    });
  });

  describe('Abundant Validation', () => {
    it('validates abundant numbers', () => {
      expect(validateAbundant(12)).toBe(true);
      expect(validateAbundant(18)).toBe(true);
      expect(validateAbundant(20)).toBe(true);
    });

    it('rejects non-abundant numbers', () => {
      expect(validateAbundant(1)).toBe(false);
      expect(validateAbundant(2)).toBe(false);
      expect(validateAbundant(3)).toBe(false);
      expect(validateAbundant(4)).toBe(false);
    });
  });

  describe('Deficient Validation', () => {
    it('validates deficient numbers', () => {
      expect(validateDeficient(1)).toBe(true);
      expect(validateDeficient(2)).toBe(true);
      expect(validateDeficient(3)).toBe(true);
      expect(validateDeficient(4)).toBe(true);
    });

    it('rejects non-deficient numbers', () => {
      expect(validateDeficient(6)).toBe(false);
      expect(validateDeficient(12)).toBe(false);
      expect(validateDeficient(18)).toBe(false);
      expect(validateDeficient(20)).toBe(false);
    });
  });

  describe('Triangular Validation', () => {
    it('validates triangular numbers', () => {
      expect(validateTriangular(1)).toBe(true);
      expect(validateTriangular(3)).toBe(true);
      expect(validateTriangular(6)).toBe(true);
      expect(validateTriangular(10)).toBe(true);
    });

    it('rejects non-triangular numbers', () => {
      expect(validateTriangular(2)).toBe(false);
      expect(validateTriangular(4)).toBe(false);
      expect(validateTriangular(5)).toBe(false);
      expect(validateTriangular(7)).toBe(false);
    });
  });

  describe('Square Validation', () => {
    it('validates square numbers', () => {
      expect(validateSquare(1)).toBe(true);
      expect(validateSquare(4)).toBe(true);
      expect(validateSquare(9)).toBe(true);
      expect(validateSquare(16)).toBe(true);
    });

    it('rejects non-square numbers', () => {
      expect(validateSquare(2)).toBe(false);
      expect(validateSquare(3)).toBe(false);
      expect(validateSquare(5)).toBe(false);
      expect(validateSquare(6)).toBe(false);
    });
  });

  describe('Cubic Validation', () => {
    it('validates cubic numbers', () => {
      expect(validateCubic(1)).toBe(true);
      expect(validateCubic(8)).toBe(true);
      expect(validateCubic(27)).toBe(true);
      expect(validateCubic(64)).toBe(true);
    });

    it('rejects non-cubic numbers', () => {
      expect(validateCubic(2)).toBe(false);
      expect(validateCubic(3)).toBe(false);
      expect(validateCubic(4)).toBe(false);
      expect(validateCubic(5)).toBe(false);
    });
  });

  describe('Fibonacci Validation', () => {
    it('validates Fibonacci numbers', () => {
      expect(validateFibonacci(1)).toBe(true);
      expect(validateFibonacci(2)).toBe(true);
      expect(validateFibonacci(3)).toBe(true);
      expect(validateFibonacci(5)).toBe(true);
      expect(validateFibonacci(8)).toBe(true);
    });

    it('rejects non-Fibonacci numbers', () => {
      expect(validateFibonacci(4)).toBe(false);
      expect(validateFibonacci(6)).toBe(false);
      expect(validateFibonacci(7)).toBe(false);
      expect(validateFibonacci(9)).toBe(false);
    });
  });

  describe('Lucas Validation', () => {
    it('validates Lucas numbers', () => {
      expect(validateLucas(2)).toBe(true);
      expect(validateLucas(1)).toBe(true);
      expect(validateLucas(3)).toBe(true);
      expect(validateLucas(4)).toBe(true);
      expect(validateLucas(7)).toBe(true);
    });

    it('rejects non-Lucas numbers', () => {
      expect(validateLucas(5)).toBe(false);
      expect(validateLucas(6)).toBe(false);
      expect(validateLucas(8)).toBe(false);
      expect(validateLucas(9)).toBe(false);
    });
  });

  describe('Pell Validation', () => {
    it('validates Pell numbers', () => {
      expect(validatePell(0)).toBe(true);
      expect(validatePell(1)).toBe(true);
      expect(validatePell(2)).toBe(true);
      expect(validatePell(5)).toBe(true);
      expect(validatePell(12)).toBe(true);
    });

    it('rejects non-Pell numbers', () => {
      expect(validatePell(3)).toBe(false);
      expect(validatePell(4)).toBe(false);
      expect(validatePell(6)).toBe(false);
      expect(validatePell(7)).toBe(false);
    });
  });

  describe('Pell-Lucas Validation', () => {
    it('validates Pell-Lucas numbers', () => {
      expect(validatePellLucas(2)).toBe(true);
      expect(validatePellLucas(2)).toBe(true);
      expect(validatePellLucas(6)).toBe(true);
      expect(validatePellLucas(14)).toBe(true);
      expect(validatePellLucas(34)).toBe(true);
    });

    it('rejects non-Pell-Lucas numbers', () => {
      expect(validatePellLucas(1)).toBe(false);
      expect(validatePellLucas(3)).toBe(false);
      expect(validatePellLucas(4)).toBe(false);
      expect(validatePellLucas(5)).toBe(false);
    });
  });

  describe('Jacobsthal Validation', () => {
    it('validates Jacobsthal numbers', () => {
      expect(validateJacobsthal(0)).toBe(true);
      expect(validateJacobsthal(1)).toBe(true);
      expect(validateJacobsthal(3)).toBe(true);
      expect(validateJacobsthal(5)).toBe(true);
      expect(validateJacobsthal(11)).toBe(true);
    });

    it('rejects non-Jacobsthal numbers', () => {
      expect(validateJacobsthal(2)).toBe(false);
      expect(validateJacobsthal(4)).toBe(false);
      expect(validateJacobsthal(6)).toBe(false);
      expect(validateJacobsthal(7)).toBe(false);
    });
  });

  describe('Jacobsthal-Lucas Validation', () => {
    it('validates Jacobsthal-Lucas numbers', () => {
      expect(validateJacobsthalLucas(2)).toBe(true);
      expect(validateJacobsthalLucas(1)).toBe(true);
      expect(validateJacobsthalLucas(5)).toBe(true);
      expect(validateJacobsthalLucas(7)).toBe(true);
      expect(validateJacobsthalLucas(17)).toBe(true);
    });

    it('rejects non-Jacobsthal-Lucas numbers', () => {
      expect(validateJacobsthalLucas(3)).toBe(false);
      expect(validateJacobsthalLucas(4)).toBe(false);
      expect(validateJacobsthalLucas(6)).toBe(false);
      expect(validateJacobsthalLucas(8)).toBe(false);
    });
  });

  describe('Padovan Validation', () => {
    it('validates Padovan numbers', () => {
      expect(validatePadovan(1)).toBe(true);
      expect(validatePadovan(1)).toBe(true);
      expect(validatePadovan(2)).toBe(true);
      expect(validatePadovan(2)).toBe(true);
      expect(validatePadovan(3)).toBe(true);
    });

    it('rejects non-Padovan numbers', () => {
      expect(validatePadovan(4)).toBe(false);
      expect(validatePadovan(5)).toBe(false);
      expect(validatePadovan(6)).toBe(false);
      expect(validatePadovan(7)).toBe(false);
    });
  });

  describe('Perrin Validation', () => {
    it('validates Perrin numbers', () => {
      expect(validatePerrin(3)).toBe(true);
      expect(validatePerrin(0)).toBe(true);
      expect(validatePerrin(2)).toBe(true);
      expect(validatePerrin(3)).toBe(true);
      expect(validatePerrin(2)).toBe(true);
    });

    it('rejects non-Perrin numbers', () => {
      expect(validatePerrin(1)).toBe(false);
      expect(validatePerrin(4)).toBe(false);
      expect(validatePerrin(5)).toBe(false);
      expect(validatePerrin(6)).toBe(false);
    });
  });

  describe('Tribonacci Validation', () => {
    it('validates Tribonacci numbers', () => {
      expect(validateTribonacci(0)).toBe(true);
      expect(validateTribonacci(0)).toBe(true);
      expect(validateTribonacci(1)).toBe(true);
      expect(validateTribonacci(1)).toBe(true);
      expect(validateTribonacci(2)).toBe(true);
    });

    it('rejects non-Tribonacci numbers', () => {
      expect(validateTribonacci(3)).toBe(false);
      expect(validateTribonacci(4)).toBe(false);
      expect(validateTribonacci(5)).toBe(false);
      expect(validateTribonacci(6)).toBe(false);
    });
  });

  describe('Tetranacci Validation', () => {
    it('validates Tetranacci numbers', () => {
      expect(validateTetranacci(0)).toBe(true);
      expect(validateTetranacci(0)).toBe(true);
      expect(validateTetranacci(0)).toBe(true);
      expect(validateTetranacci(1)).toBe(true);
      expect(validateTetranacci(1)).toBe(true);
    });

    it('rejects non-Tetranacci numbers', () => {
      expect(validateTetranacci(2)).toBe(false);
      expect(validateTetranacci(3)).toBe(false);
      expect(validateTetranacci(4)).toBe(false);
      expect(validateTetranacci(5)).toBe(false);
    });
  });

  describe('Pentanacci Validation', () => {
    it('validates Pentanacci numbers', () => {
      expect(validatePentanacci(0)).toBe(true);
      expect(validatePentanacci(0)).toBe(true);
      expect(validatePentanacci(0)).toBe(true);
      expect(validatePentanacci(0)).toBe(true);
      expect(validatePentanacci(1)).toBe(true);
    });

    it('rejects non-Pentanacci numbers', () => {
      expect(validatePentanacci(2)).toBe(false);
      expect(validatePentanacci(3)).toBe(false);
      expect(validatePentanacci(4)).toBe(false);
      expect(validatePentanacci(5)).toBe(false);
    });
  });

  describe('Hexanacci Validation', () => {
    it('validates Hexanacci numbers', () => {
      expect(validateHexanacci(0)).toBe(true);
      expect(validateHexanacci(0)).toBe(true);
      expect(validateHexanacci(0)).toBe(true);
      expect(validateHexanacci(0)).toBe(true);
      expect(validateHexanacci(0)).toBe(true);
    });

    it('rejects non-Hexanacci numbers', () => {
      expect(validateHexanacci(1)).toBe(false);
      expect(validateHexanacci(2)).toBe(false);
      expect(validateHexanacci(3)).toBe(false);
      expect(validateHexanacci(4)).toBe(false);
    });
  });

  describe('Heptanacci Validation', () => {
    it('validates Heptanacci numbers', () => {
      expect(validateHeptanacci(0)).toBe(true);
      expect(validateHeptanacci(0)).toBe(true);
      expect(validateHeptanacci(0)).toBe(true);
      expect(validateHeptanacci(0)).toBe(true);
      expect(validateHeptanacci(0)).toBe(true);
    });

    it('rejects non-Heptanacci numbers', () => {
      expect(validateHeptanacci(1)).toBe(false);
      expect(validateHeptanacci(2)).toBe(false);
      expect(validateHeptanacci(3)).toBe(false);
      expect(validateHeptanacci(4)).toBe(false);
    });
  });

  describe('Octanacci Validation', () => {
    it('validates Octanacci numbers', () => {
      expect(validateOctanacci(0)).toBe(true);
      expect(validateOctanacci(0)).toBe(true);
      expect(validateOctanacci(0)).toBe(true);
      expect(validateOctanacci(0)).toBe(true);
      expect(validateOctanacci(0)).toBe(true);
    });

    it('rejects non-Octanacci numbers', () => {
      expect(validateOctanacci(1)).toBe(false);
      expect(validateOctanacci(2)).toBe(false);
      expect(validateOctanacci(3)).toBe(false);
      expect(validateOctanacci(4)).toBe(false);
    });
  });

  describe('Nonanacci Validation', () => {
    it('validates Nonanacci numbers', () => {
      expect(validateNonanacci(0)).toBe(true);
      expect(validateNonanacci(0)).toBe(true);
      expect(validateNonanacci(0)).toBe(true);
      expect(validateNonanacci(0)).toBe(true);
      expect(validateNonanacci(0)).toBe(true);
    });

    it('rejects non-Nonanacci numbers', () => {
      expect(validateNonanacci(1)).toBe(false);
      expect(validateNonanacci(2)).toBe(false);
      expect(validateNonanacci(3)).toBe(false);
      expect(validateNonanacci(4)).toBe(false);
    });
  });

  describe('Decanacci Validation', () => {
    it('validates Decanacci numbers', () => {
      expect(validateDecanacci(0)).toBe(true);
      expect(validateDecanacci(0)).toBe(true);
      expect(validateDecanacci(0)).toBe(true);
      expect(validateDecanacci(0)).toBe(true);
      expect(validateDecanacci(0)).toBe(true);
    });

    it('rejects non-Decanacci numbers', () => {
      expect(validateDecanacci(1)).toBe(false);
      expect(validateDecanacci(2)).toBe(false);
      expect(validateDecanacci(3)).toBe(false);
      expect(validateDecanacci(4)).toBe(false);
    });
  });
});