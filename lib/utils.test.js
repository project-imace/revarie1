import assert from 'node:assert';
import { cn } from './utils.js';

console.log('Running tests for lib/utils.js...');

function testCn() {
  console.log('Testing cn...');

  // Single class string
  assert.strictEqual(cn('text-red-500'), 'text-red-500');

  // Multiple class strings
  assert.strictEqual(cn('text-red-500', 'bg-blue-500'), 'text-red-500 bg-blue-500');

  // Conditional classes (object syntax)
  assert.strictEqual(cn('a', { b: true, c: false }), 'a b');

  // Conditional classes (boolean/null/undefined)
  const isTrue = true;
  const isFalse = false;
  assert.strictEqual(cn('a', isTrue && 'b', isFalse && 'c', null, undefined), 'a b');

  // Tailwind class merging
  // twMerge should handle overlapping classes
  assert.strictEqual(cn('px-2 py-2', 'px-4'), 'py-2 px-4');

  // Nested arrays
  assert.strictEqual(cn(['a', 'b'], 'c'), 'a b c');

  // Empty inputs
  assert.strictEqual(cn(), '');

  console.log('✅ cn passed');
}

try {
  testCn();
  console.log('All tests passed! 🎉');
} catch (error) {
  console.error('Test failed! ❌');
  console.error(error);
  process.exit(1);
}
