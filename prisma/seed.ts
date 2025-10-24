import { PrismaClient } from '@prisma/client';

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

    const superAdminRole = await prisma.role.create({
        data: { title: 'Super Admin' },
    });

    // Create permissions
    const permissions = await prisma.permission.createMany({
        data: [
            {
                code: "dashboard:view",
                title: "View Dashboard"
            },
            {
                code: "branch:create",
                title: "Create Branch"
            },
            {
                code: "branch:update",
                title: "Update Branch"
            },
            {
                code: "branch:view",
                title: "View Branch"
            },
            {
                code: "branch:delete",
                title: "Delete Branch"
            },
            {
                code: "user:create",
                title: "Create User"
            },
            {
                code: "user:update",
                title: "Update User"
            },
            {
                code: "user:view",
                title: "View User"
            },
            {
                code: "user:delete",
                title: "Delete User"
            },
            {
                code: "role:create",
                title: "Create Role"
            },
            {
                code: "permission:create",
                title: "Create Permission"
            },
            {
                code: "permission:update",
                title: "Update Permission"
            },
            {
                code: "permission:view",
                title: "View Permissions"
            },
            {
                code: "permission:delete",
                title: "Delete Permission"
            },
            {
                code: "role:update",
                title: "Update Role"
            },
            {
                code: "role:delete",
                title: "Delete Role"
            },
            {
                code: "role:view",
                title: "View Role"
            },
        ],
    });

    const rolePerms = await prisma.rolePermission.createMany({
        data: [{
            roleId: 3,
            permId: 1
        }, {
            roleId: 3,
            permId: 2
        }, {
            roleId: 3,
            permId: 3
        }, {
            roleId: 3,
            permId: 4
        }, {
            roleId: 3,
            permId: 5
        }, {
            roleId: 3,
            permId: 6
        }, {
            roleId: 3,
            permId: 7
        }, {
            roleId: 3,
            permId: 8
        }, {
            roleId: 3,
            permId: 9
        }, {
            roleId: 3,
            permId: 10
        }, {
            roleId: 3,
            permId: 11
        }, {
            roleId: 3,
            permId: 12
        }, {
            roleId: 3,
            permId: 13
        }, {
            roleId: 3,
            permId: 14
        }, {
            roleId: 3,
            permId: 15
        }, {
            roleId: 3,
            permId: 16
        }, {
            roleId: 3,
            permId: 17
        }]
    })
    // Create a branch
    const branch = await prisma.branch.create({
        data: {
            id: 'BR001',
            address: '123 Main St',
            phoneNo: '03214884763',
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
                    password: '$2a$10$7NwTOkD1JXEiSeOgWMuM5OAFEls0UqaJu/Q3Xq9vJ6TwLRQT/3rwe',
                    roleId: managerRole.id,
                    status: 'ACTIVE',
                },
            },
        },
    });

    // Create a superAdmin
    const superAdmin = await prisma.user.create({
        data: {
            email: 'ammadmughal567@example.com',
            name: 'John Doe',
            phoneNo: '03214884763',
            password: '$2a$10$7NwTOkD1JXEiSeOgWMuM5OAFEls0UqaJu/Q3Xq9vJ6TwLRQT/3rwe',
            roleId: superAdminRole.id,
            status: 'ACTIVE',
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
