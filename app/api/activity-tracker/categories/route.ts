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

        // 3. Get the start and end of the day in UTC
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();

        const startOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999));

        // 4. Get all 5 activity types for the user
        const total_emissions_based_categories = await ActivityLog.aggregate([
            { $match: { userId: user._id.toString(), timestamp: { $gte: startOfDay, $lte: endOfDay } }},
            { $group: { _id: "$activityType", totalEmissions: { $sum: "$prediction" } } },
            { $project: { _id: 0, activityType: "$_id", totalEmissions: { $round: ["$totalEmissions", 2] } } },
            { $sort: { totalEmissions: 1 } },
        ]);
        return NextResponse.json({ total_emissions_based_categories });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}