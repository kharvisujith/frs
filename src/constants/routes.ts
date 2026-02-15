/**
 * Application Route Paths
 * Centralized constants for all application routes
 */

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/product/:id',
    CATEGORY: '/category/:slug',
} as const;

/**
 * Helper function to generate product detail route
 */
export const getProductRoute = (id: string) => `/product/${id}`;

/**
 * Helper function to generate category route
 */
export const getCategoryRoute = (slug: string) => `/category/${slug}`;
