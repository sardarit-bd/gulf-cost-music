// export const getDashboardRoutes = (userRole) => {
//     const routes = {
//         // Common routes for all roles
//         common: [
//             { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
//         ],

//         // Role-specific routes
//         user: [
//             { name: 'My Orders', path: '/dashboard/user/orders', icon: '📦' },
//         ],
//         artist: [
//             { name: 'Artist Dashboard', path: '/dashboard/admin/artist/orders', icon: '🎵' },
//             { name: 'My Orders', path: '/dashboard/admin/artist/orders', icon: '📦' },
//         ],
//         venue: [
//             { name: 'Venue Dashboard', path: '/dashboard/venue', icon: '🏟️' },
//             { name: 'My Orders', path: '/dashboard/venue/orders', icon: '📦' },
//         ],
//         journalist: [
//             { name: 'Journalist Dashboard', path: '/dashboard/journalist', icon: '📰' },
//             { name: 'My Orders', path: '/dashboard/journalist/orders', icon: '📦' },
//         ],
//         admin: [
//             { name: 'Admin Dashboard', path: '/dashboard/admin', icon: '⚙️' },
//             { name: 'All Orders', path: '/dashboard/admin/orders', icon: '📦' },
//         ]
//     };

//     return {
//         common: routes.common,
//         specific: routes[userRole] || []
//     };
// };