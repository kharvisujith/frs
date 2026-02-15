/**
 * Services Index
 * 
 * Centralized export point for all service functions.
 * Import services from this file throughout the application.
 * 
 * @example
 * import { getProducts, createProduct, updateCategory } from '@/services';
 */

// ============================================
// CATEGORY SERVICES
// ============================================
export {
    // Read
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    // Create
    createCategory,
    // Update
    updateCategory,
    // Delete
    deleteCategory
} from './categoryService';

// ============================================
// PRODUCT SERVICES
// ============================================
export {
    // Read
    getProducts,
    getProductById,
    getProductsByCategoryId,
    getProductsByCategory,
    // Create
    createProduct,
    // Update
    updateProduct,
    updateProductsCategory,
    // Delete
    deleteProduct
} from './productService';

// ============================================
// ENQUIRY SERVICES
// ============================================
export {
    // Create
    saveProductEnquiry,
    saveContactEnquiry,
    // Read
    getProductEnquiries,
    getContactEnquiries,
    getProductEnquiryById,
    getContactEnquiryById,
    getEnquiriesByProduct,
    // Update
    updateProductEnquiryStatus,
    updateContactEnquiryStatus,
    markProductEnquiryEmailSent,
    markContactEnquiryEmailSent,
    // Delete
    deleteProductEnquiry,
    deleteContactEnquiry
} from './enquiryService';
