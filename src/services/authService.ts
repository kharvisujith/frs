import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminUser } from "@/models";

import { COLLECTIONS } from "@/constants";

const COLLECTION_NAME = COLLECTIONS.ADMIN_USERS;

export const verifyAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        console.log(`[Auth] Checking user: ${username}, Found docs: ${querySnapshot.size}`);

        if (querySnapshot.empty) {
            console.log("[Auth] User not found");
            return false;
        }

        // Check password for the found user(s)
        // In a real app, we would hash passwords, but for this simple version we compare directly
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as AdminUser;

        const isMatch = userData.password === password;
        console.log(`[Auth] Password match: ${isMatch}`);
        return isMatch;
    } catch (error) {
        console.error("Error verifying admin:", error);
        return false;
    }
};
