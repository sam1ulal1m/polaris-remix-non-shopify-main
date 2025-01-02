// Desc: Controller for user related operations
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel';

export const createUser = async (email: string, password: string) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const newUserResponse = await User.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        if (newUserResponse?.email) {
            console.log("User created:", newUserResponse.email);
            return { success: true, newUserResponse };
        } else {
            throw new Error(JSON.stringify(newUserResponse));
        }
    } catch (error) {
        console.log("Error creating user:", error);
        return { success: false, error };
    }

}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await User.findUnique({
            where: {
                email,
            },
        });
        return user;
    } catch (error) {
        return error;
    }
}
export const getUserById = async (id: number) => {
    try {
        const user = await User.findUnique({
            where: {
                id,
            },
        });
        return user;
    } catch (error) {
        return error;
    }
}

export const authenticateUser = async (email: string, password: string) => {
    try {
        const user = await getUserByEmail(email);
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Generate JWT token
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET || '936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af',
                    { expiresIn: '48h' }
                );
                return { success: true, token };
            } else {
                return { success: false, error: 'Invalid password' };
            }
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        return { success: false, error };
    }
}

