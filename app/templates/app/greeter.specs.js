import greeter from 'greeter';

describe('The greeter', () => {
  it('should greet', () => {
    expect(greeter.greet('World')).toBe('Hello World!');
  });
});

describe('Function.prototype.bind', () => {
  it('should be a function', () => {
    expect(typeof Function.prototype.bind).toBe('function');
  });
});
