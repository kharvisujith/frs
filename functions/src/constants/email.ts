/**
 * Email Configuration Constants
 */

export const EMAIL_CONFIG = {
    // This should be replaced with your verified SendGrid sender email
    SENDER_EMAIL: 'your_verified_email@gmail.com',

    // Subject line templates
    CONTACT_SUBJECT: (name: string) => `New Contact Enquiry from ${name}`,
    PRODUCT_SUBJECT: (productName: string, customerName: string) =>
        `New Product Enquiry: ${productName} - ${customerName}`,
} as const;

export const EMAIL_STYLES = {
    CONTAINER: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
    HEADER: 'color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;',
    TABLE: 'width: 100%; margin: 20px 0; border-collapse: collapse;',
    TABLE_CELL: 'padding: 8px; border-bottom: 1px solid #e5e7eb;',
    MESSAGE_BOX: 'background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;',
    ACTION_BOX: 'background: #eff6ff; padding: 12px; border-left: 4px solid #2563eb; margin-top: 20px;',
    FOOTER: 'color: #6b7280; font-size: 12px;',
} as const;
