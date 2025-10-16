import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main()
{
    console.log('🌱 Seeding database...');

    // Create roles
    const adminRole = await prisma.role.create({
        data: { title: 'Admin' },
    });

    const managerRole = await prisma.role.create({
        data: { title: 'Manager' },
    });

    // Create permissions
    const permissions = await prisma.permission.createMany({
        data: [
            { title: 'View Reports' },
            { title: 'Manage Users' },
            { title: 'Manage Inventory' },
        ],
    });

    // Create a branch
    const branch = await prisma.branch.create({
        data: {
            id: 'BR001',
            address: '123 Main St',
            city: 'Lahore',
            area: 'Gulberg',
            status: 'ACTIVE',
            openingTime: new Date('1970-01-01T09:00:00Z'),
            closingTime: new Date('1970-01-01T18:00:00Z'),
            BranchManager: {
                create: {
                    email: 'manager@example.com',
                    name: 'Branch Manager',
                    phoneNo: '03001234567',
                    password: 'securepassword',
                    roleId: managerRole.id,
                    status: 'ACTIVE',
                },
            },
        },
    });

    // Create a customer
    const customer = await prisma.user.create({
        data: {
            email: 'customer@example.com',
            name: 'John Doe',
            phoneNo: '03111234567',
            password: 'password123',
            roleId: adminRole.id,
            status: 'ACTIVE',
            Customer: {
                create: {
                    address: '45 Model Town',
                    city: 'Lahore',
                    area: 'Block A',
                },
            },
        },
    });

    console.log('✅ Seeding completed successfully.');
}

main()
    .catch((e) =>
    {
        console.error(e);
        process.exit(1);
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });
