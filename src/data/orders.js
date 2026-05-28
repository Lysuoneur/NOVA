export const seedOrders = () => ([{
    id: "o1",
    userEmail: "user@nova.com",
    status: "Processing",
    createdAt: new Date().toISOString(),
    items: [
        { id: "p1", title: "HADES Bolt Tee", size: "M", qty: 1, price: 24.99 },
        { id: "p3", title: "COZY Hoodie", size: "L", qty: 1, price: 59.99 },
    ],
    subtotal: 84.98,
    shipping: 3.99,
    total: 88.97,
    address: {
        name: "NOVA User",
        phone: "+855 12 345 678",
        city: "Phnom Penh",
        line1: "Street 123",
    },
}, ]);