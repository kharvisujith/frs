export interface AdminUser {
    id: string;
    username: string;
    password: string; // Stored as plain text for simple comparison as per user request
}
