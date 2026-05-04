const fs = require('fs');
const path = require('path');

describe('Task T1.3: Prisma Client Singleton & Graceful Shutdown Verification', () => {
    
    test('src/config/db.js should implement Singleton pattern with globalThis', () => {
        const filePath = path.join(__dirname, '../src/config/db.js');
        const content = fs.readFileSync(filePath, 'utf8');
        
        expect(content).toContain('globalThis');
        expect(content).toContain('module.exports = prisma');
        expect(content).toContain('new PrismaClient');
    });

    test('src/config/db.js should have conditional logging', () => {
        const filePath = path.join(__dirname, '../src/config/db.js');
        const content = fs.readFileSync(filePath, 'utf8');
        
        expect(content).toContain("process.env.NODE_ENV === 'development'");
    });

    test('src/server.js should implement graceful shutdown handlers', () => {
        const filePath = path.join(__dirname, '../src/server.js');
        const content = fs.readFileSync(filePath, 'utf8');
        
        expect(content).toContain("process.on('SIGINT'");
        expect(content).toContain("process.on('SIGTERM'");
        expect(content).toContain("prisma.$disconnect()");
        expect(content).toContain("server.close");
    });

    test('Check for Prisma 7 compatibility in config', () => {
        const filePath = path.join(__dirname, '../src/config/db.js');
        const content = fs.readFileSync(filePath, 'utf8');
        
        // In Prisma 7, we don't pass the URL to the constructor if using prisma.config.ts
        expect(content).not.toContain('datasources'); 
    });
});
