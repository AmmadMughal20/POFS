// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main()
// {
//     console.log('🌱 Seeding database...');

//     // Create roles
//     const adminRole = await prisma.role.create({
//         data: { title: 'Admin' },
//     });

//     const managerRole = await prisma.role.create({
//         data: { title: 'Manager' },
//     });

//     const superAdminRole = await prisma.role.create({
//         data: { title: 'Super Admin' },
//     });

//     // Create permissions
//     const permissions = await prisma.permission.createMany({
//         data: [
//             {
//                 code: "dashboard:view",
//                 title: "View Dashboard"
//             },
//             {
//                 code: "branch:create",
//                 title: "Create Branch"
//             },
//             {
//                 code: "branch:update",
//                 title: "Update Branch"
//             },
//             {
//                 code: "branch:view",
//                 title: "View Branch"
//             },
//             {
//                 code: "branch:delete",
//                 title: "Delete Branch"
//             },
//             {
//                 code: "user:create",
//                 title: "Create User"
//             },
//             {
//                 code: "user:update",
//                 title: "Update User"
//             },
//             {
//                 code: "user:view",
//                 title: "View User"
//             },
//             {
//                 code: "user:delete",
//                 title: "Delete User"
//             },
//             {
//                 code: "role:create",
//                 title: "Create Role"
//             },
//             {
//                 code: "permission:create",
//                 title: "Create Permission"
//             },
//             {
//                 code: "permission:update",
//                 title: "Update Permission"
//             },
//             {
//                 code: "permission:view",
//                 title: "View Permissions"
//             },
//             {
//                 code: "permission:delete",
//                 title: "Delete Permission"
//             },
//             {
//                 code: "role:update",
//                 title: "Update Role"
//             },
//             {
//                 code: "role:delete",
//                 title: "Delete Role"
//             },
//             {
//                 code: "role:view",
//                 title: "View Role"
//             },
//         ],
//     });

//     const rolePerms = await prisma.rolePermission.createMany({
//         data: [{
//             roleId: 3,
//             permId: 1
//         }, {
//             roleId: 3,
//             permId: 2
//         }, {
//             roleId: 3,
//             permId: 3
//         }, {
//             roleId: 3,
//             permId: 4
//         }, {
//             roleId: 3,
//             permId: 5
//         }, {
//             roleId: 3,
//             permId: 6
//         }, {
//             roleId: 3,
//             permId: 7
//         }, {
//             roleId: 3,
//             permId: 8
//         }, {
//             roleId: 3,
//             permId: 9
//         }, {
//             roleId: 3,
//             permId: 10
//         }, {
//             roleId: 3,
//             permId: 11
//         }, {
//             roleId: 3,
//             permId: 12
//         }, {
//             roleId: 3,
//             permId: 13
//         }, {
//             roleId: 3,
//             permId: 14
//         }, {
//             roleId: 3,
//             permId: 15
//         }, {
//             roleId: 3,
//             permId: 16
//         }, {
//             roleId: 3,
//             permId: 17
//         }]
//     })
//     // Create a branch
//     const branch = await prisma.branch.create({
//         data: {
//             id: 'BR001',
//             address: '123 Main St',
//             phoneNo: '03214884763',
//             city: 'Lahore',
//             area: 'Gulberg',
//             status: 'ACTIVE',
//             openingTime: new Date('1970-01-01T09:00:00Z'),
//             closingTime: new Date('1970-01-01T18:00:00Z'),
//             BranchManager: {
//                 create: {
//                     email: 'manager@example.com',
//                     name: 'Branch Manager',
//                     phoneNo: '03001234567',
//                     password: '$2a$10$7NwTOkD1JXEiSeOgWMuM5OAFEls0UqaJu/Q3Xq9vJ6TwLRQT/3rwe',
//                     roleId: managerRole.id,
//                     status: 'ACTIVE',
//                 },
//             },
//         },
//     });

//     // Create a superAdmin
//     const superAdmin = await prisma.user.create({
//         data: {
//             email: 'ammadmughal567@example.com',
//             name: 'John Doe',
//             phoneNo: '03214884763',
//             password: '$2a$10$7NwTOkD1JXEiSeOgWMuM5OAFEls0UqaJu/Q3Xq9vJ6TwLRQT/3rwe',
//             roleId: superAdminRole.id,
//             status: 'ACTIVE',
//         },
//     });

//     console.log('✅ Seeding completed successfully.');
// }

// main()
//     .catch((e) =>
//     {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () =>
//     {
//         await prisma.$disconnect();
//     });

import { PrismaClient, UserStatus, Province, DiscountType, BusinessType } from '@prisma/client';
const prisma = new PrismaClient();

async function main()
{
    console.log('🧹 Clearing existing data...');

    await prisma.$transaction([
        // --- Deep child tables first ---
        prisma.rolePermission.deleteMany(),  // depends on Role & Permission
        prisma.stock.deleteMany(),           // depends on Branch & Product
        prisma.orderItem.deleteMany(),       // depends on Order & Product
        prisma.discount.deleteMany(),        // may depend on Product/Branch

        // --- Mid-level entities ---
        prisma.manager.deleteMany(),         // depends on User & Business
        prisma.salesMan.deleteMany(),        // depends on User & Branch
        prisma.customer.deleteMany(),        // depends on User
        prisma.product.deleteMany(),         // depends on Business, Category, Supplier
        prisma.branch.deleteMany(),          // depends on Business & Manager
        prisma.order.deleteMany(),           // depends on Customer, Branch
        prisma.category.deleteMany(),        // may depend on Business
        prisma.supplier.deleteMany(),        // may depend on Business

        // --- Top-level entities ---
        prisma.permission.deleteMany(),      // referenced by RolePermission
        prisma.user.deleteMany(),            // referenced by many child entities
        prisma.role.deleteMany(),            // referenced by User & RolePermission
        prisma.business.deleteMany(),        // root entity for branches/products etc.
    ]);
    console.log('✅ All data removed successfully.');

    console.log('🌱 Starting seed...');

    await prisma.permission.createMany({
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

    const allPermissions = await prisma.permission.findMany({
        select: { id: true },
    });

    const adminRole = await prisma.role.create({
        data: {
            title: 'Super Admin',
            rolePerms: {
                create: allPermissions.map((perm) => ({
                    permId: perm.id,
                })),
            },
        },
    })

    // --- USERS ---
    const adminUser = await prisma.user.create({
        data: {
            email: 'ammadmughal567@outlook.com',
            phoneNo: '03214884763',
            password: '$2a$10$7NwTOkD1JXEiSeOgWMuM5OAFEls0UqaJu/Q3Xq9vJ6TwLRQT/3rwe',
            name: 'Ammad Mughal',
            status: UserStatus.ACTIVE,
            roleId: adminRole.id
        },
    });

    // --- BUSINESS ---
    const business = await prisma.business.create({
        data: {
            id: 'biz-001',
            name: 'TechMart',
            type: BusinessType.BOOKSTORE,
            province: Province.PUNJAB,
            city: 'Lahore',
            address: '123 Mall Road',
            phone: '0421234567',
            ownerId: adminUser.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    // --- BRANCH ---
    const branch = await prisma.branch.create({
        data: {
            id: "B01",
            address: 'addresas',
            openingTime: new Date(),
            closingTime: new Date(),
            city: 'Lahore',
            area: 'Gulberg',
            businessId: business.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    // --- CATEGORY ---
    const category = await prisma.category.create({
        data: {
            name: 'Electronics',
            businessId: business.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    // --- SUPPLIER ---
    const supplier = await prisma.supplier.create({
        data: {
            name: 'ABC Distributors',
            contactNo: '03007894561',
            businessId: business.id,
            address: 'Lahore',
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    // --- PRODUCT ---
    const product = await prisma.product.create({
        data: {
            title: 'Smartphone X100',
            description: 'Latest Android smartphone',
            sku: 'SPX100',
            rate: 49999.99,
            businessId: business.id,
            branchId: branch.id,
            categoryId: category.id,
            supplierId: supplier.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    // --- STOCK ---
    const stock = await prisma.stock.create({
        data: {
            productId: product.id,
            stockUnits: 50,
            branchId: branch.id,
        },
    });

    // --- DISCOUNT ---
    const discount = await prisma.discount.create({
        data: {
            code: 'sda',
            validFrom: new Date(),
            validTo: new Date(),
            title: '10% Off Smartphones',
            type: DiscountType.PERCENTAGE,
            value: 10,
            businessId: business.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
            products: {
                connect: { id: product.id },
            },
        },
    });

    // --- CUSTOMER ---
    const customer = await prisma.customer.create({
        data: {
            id: adminUser.id,
            address: 'Ali Raza',
            city: 'Lahore',
            area: 'Gulshan Ravi',
            User: undefined
        },
    });

    // --- SALESMAN ---
    const salesman = await prisma.salesMan.create({
        data: {
            id: adminUser.id,
            branchId: branch.id,
            businessId: business.id,
        },
    });

    // --- ORDER ---
    const order = await prisma.order.create({
        data: {
            customerId: customer.id,
            businessId: business.id,
            branchId: branch.id,
            totalAmount: 49999.99,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
            orderItems: {
                create: [
                    {
                        productId: product.id,
                        qty: 1,
                        amount: 49999.99,
                    },
                ],
            },
        },
    });

    // --- EXPENSE ---
    const expense = await prisma.expense.create({
        data: {
            title: 'Electricity Bill',
            amount: 20000.0,
            businessId: business.id,
            branchId: branch.id,
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
        },
    });

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) =>
    {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });

