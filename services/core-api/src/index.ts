import 'dotenv/config';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaPg } from '@prisma/adapter-pg';
import express, { type Request, type Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3000;
const scrypt = promisify(crypto.scrypt);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
};

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// 1. THE FRICTIONLESS ONBOARDING ROUTE (Mobile App -> Prisma -> Supabase)
app.post('/api/users/onboarding', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      phoneNumber?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        ...(phoneNumber ? { phoneNumber } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true
      }
    });

    res.status(201).json({ message: 'User profile created successfully.', user: newUser });
  } catch (error: unknown) {
    const prismaError =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? (error as Prisma.PrismaClientKnownRequestError)
        : null;

    if (prismaError?.code === 'P2002') {
      res.status(409).json({ error: 'A user with that email already exists.' });
      return;
    }

    console.error('Failed to create user.', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// 2. THE MACHINE LEARNING ROUTE (Dummy data for presentation)
app.post('/api/journeys/risk-score', async (req: Request, res: Response) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            res.status(400).json({ error: "Missing coordinates" });
            return;
        }

        // We use the exact dummy data format
        const mlData = {
            session_id: "test-session-123",
            risk_score_raw: 0.82,
            risk_level: "high",
            contributing_factors: ["nighttime", "isolated-path"]
        };
        
        // Convert the 0.82 decimal into an 82% integer for the mobile UI
        const formattedScore = Math.round(mlData.risk_score_raw * 100);

        console.log(`ML API pinged for ${latitude}, ${longitude}. Score: ${formattedScore}`);
        
        // Send the clean data to React Native
        res.status(200).json({ 
            riskScore: formattedScore,
            riskLevel: mlData.risk_level,
            factors: mlData.contributing_factors
        });

    } catch (error) {
        console.error("Error calculating risk score:", error);
        res.status(500).json({ error: "Failed to calculate risk." });
    }
});

// ---------------------------------------------------------
// SERVER LIFECYCLE
// ---------------------------------------------------------
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});