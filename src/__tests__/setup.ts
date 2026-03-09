// Jest setup file - provides custom matchers and global configuration
import '@testing-library/jest-dom';

// Add a placeholder test to satisfy Jest's requirement for at least one test
describe('Setup', () => {
  it('should pass basic setup validation', () => {
    expect(true).toBe(true);
  });
});