import express, { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient(); // Initialize database connection

app.use(express.json());

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// The endpoint for the mobile app's onboarding questions
app.post('/api/users/onboarding', async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        
        // Use Prisma to save the new user to our database!
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: password, // In a real app, hash this before saving!
                phoneNumber: phoneNumber
            }
        });
        
        console.log("Saved new user:", newUser);
        res.status(201).json({ message: "User profile created successfully!", user: newUser });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user." });
    }
});

// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});