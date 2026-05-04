const { execSync } = require('child_process');

describe('Database Schema Validation', () => {
  test('Prisma schema should be valid and match database', () => {
    try {
      const output = execSync('npx prisma validate').toString();
      expect(output).toContain('The schema at prisma/schema.prisma is valid');
    } catch (error) {
      throw new Error(`Schema validation failed: ${error.stdout.toString()}`);
    }
  });

  test('Database should be reachable and introspectable', () => {
    try {
      const output = execSync('npx prisma db pull --print').toString();
      expect(output).toContain('model User');
      expect(output).toContain('model Company');
      expect(output).toContain('model Transaction');
      expect(output).toContain('amount      Decimal');
      expect(output).toContain('type        TransactionType');
    } catch (error) {
      throw new Error(`Database introspection failed: ${error.stdout.toString()}`);
    }
  });
});
