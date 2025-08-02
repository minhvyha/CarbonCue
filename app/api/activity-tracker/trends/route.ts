import { NextRequest, NextResponse } from 'next/server';
import ActivityLog from '@/model/ActivityLog';
import { connectToDatabase } from '@/lib/mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken'; 
import { getCurrentUser } from '@/lib/getCurrentUser';

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate user from token
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
            // 2. Connect to MongoDB
        const conn = await connectToDatabase();
        if (!conn) {
            return NextResponse.json({ error: "Failed to connect to MongoDB" }, { status: 500 });
        }
            console.log('Mongo readyState:', conn.connection.readyState);

        // 3. Get the year.
        const year = new Date().getUTCFullYear();

        // 4. Get the total emissions for the user for the year
        const totalEmissions = await ActivityLog.aggregate([
            {
                $match: {
                    userId: user._id.toString(),
                    timestamp: {
                      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                      $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                  }
            },
            {
                $group: {
                  _id: { month: { $month: "$timestamp" } },
                  totalEmissions: { $sum: "$prediction" }
                }
            },
            {
                $project: {
                  _id: 0,
                  month: "$_id.month",
                  totalEmissions: { $round: ["$totalEmissions", 2] }
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);

        return NextResponse.json({ totalEmissions });
    } catch (error) {
        console.error('Error fetching trends:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}