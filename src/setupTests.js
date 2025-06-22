import '@testing-library/jest-dom';
import 'openai/shims/node';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock TextEncoder if not available
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// Mock TextDecoder if not available
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
} 