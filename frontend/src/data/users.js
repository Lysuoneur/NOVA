export const seedUsers = () => ([
    { id: "u1", email: "admin@nova.com", name: "Admin", role: "admin", banned: false, wishlist: [], orders: [] },
    { id: "u2", email: "user@nova.com", name: "NOVA User", role: "user", banned: false, wishlist: ["p3"], orders: [] },
]);