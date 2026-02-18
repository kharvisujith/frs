
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/constants";

export const seedAdminUser = async () => {
    try {
        const adminRef = collection(db, COLLECTIONS.ADMIN_USERS);

        // Check if exists
        const q = query(adminRef, where("username", "==", "admin"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log("Admin user already exists");
            return { success: false, message: "Admin user already exists" };
        }

        // Create
        await addDoc(adminRef, {
            username: "admin",
            password: "admin123", // Default password
            createdAt: new Date()
        });

        console.log("Admin user created successfully");
        return { success: true, message: "Admin user created! (admin / admin123)" };
    } catch (error) {
        console.error("Error seeding admin:", error);
        return { success: false, message: "Failed to create admin user. Check console." };
    }
};
