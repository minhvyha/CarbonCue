import { NextRequest, NextResponse } from "next/server";
import ActivityLog from "@/model/ActivityLog";
import { connectToDatabase } from "@/lib/mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/lib/getCurrentUser";

const Activity_MAP: Record<string, string> = {
  transportation: "predictTransport",
  home_energy: "predictHomeEnergy",
  digital_usage: "predictDigitalUsage",
  shopping: "predictShopping",
  food_diet: "predictFoodDiet",
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse and validate request body
    const { activityType, input, notes, date } = await request.json();

    console.log("Activity Type:", activityType);
    console.log("Activity Details:", input);
    console.log("Notes:", notes);
    console.log("Date:", date);

    if (!activityType || !input) {
      return NextResponse.json(
        { error: "Missing activity type or input" },
        { status: 401 }
      );
    }

    // 3. Fetch prediction from AI model
    const endpoint = Activity_MAP[activityType as keyof typeof Activity_MAP];
    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid activity type" },
        { status: 402 }
      );
    }

    let preparedInput: Record<string, any>;

    switch (activityType) {
      case "transportation":
        preparedInput = {
          transport: input.transport,
          vehicle_type: input.vehicle_type,
          vehicle_monthly_distance_km: input.vehicle_monthly_distance_km,
          frequency_of_traveling_by_air: input.frequency_of_traveling_by_air,
        };
        break;
      case "home_energy":
        preparedInput = {
          heating_energy_source: input.heating_energy_source,
          energy_efficiency: input.energy_efficiency,
          how_long_tv_pc_daily_hour: input.how_long_tv_pc_daily_hour,
        };
        break;
      case "digital_usage":
        preparedInput = {
          how_long_internet_daily_hour: input.how_long_internet_daily_hour,
        };
        break;
      case "shopping":
        preparedInput = {
          how_many_new_clothes_monthly: input.how_many_new_clothes_monthly,
          waste_bag_size: input.waste_bag_size,
          waste_bag_weekly_count: input.waste_bag_weekly_count,
          recycling: JSON.parse(input.recycling),
        };
        break;
      case "food_diet":
        preparedInput = {
          diet: input.diet,
          monthly_grocery_bill: input.monthly_grocery_bill,
        };
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported activity type" },
          { status: 400 }
        );
    }

    console.log("Prepared input:", preparedInput);

    const apiUrl = "https://carboncueapi-production-7a64.up.railway.app/";
    const fullUrl = `${apiUrl}/${endpoint}`;

    console.log("🌐 ML API URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preparedInput),
    });

    const text = await response.text();
    console.log("📥 Raw ML API Response:", text);

    if (!response.ok) {
      console.error("❌ ML API Error - Status:", response.status);
      console.error("❌ ML API Error - Response:", text);
      return NextResponse.json(
        {
          error: "Prediction API failed",
          details: text,
          status: response.status,
        },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ Failed to parse ML API response:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON response from ML API", details: text },
        { status: 500 }
      );
    }

    const predictedEmission = parsed.predicted_carbon_emission;

    if (predictedEmission === undefined || predictedEmission === null) {
      console.error(
        "❌ Missing predicted_carbon_emission in response:",
        parsed
      );
      return NextResponse.json(
        {
          error: "Invalid ML API response format",
          details: "Missing predicted_carbon_emission field",
          response: parsed,
        },
        { status: 500 }
      );
    }

    console.log("Input:", input);
    console.log("Predicted emission:", predictedEmission);

    // 4. Create activity log and save to MongoDB
    const conn = await connectToDatabase();
    console.log("Mongo readyState:", conn.connection.readyState);

    const saved = await ActivityLog.create({
      userId: user._id,
      activityType,
      activityDetails: preparedInput,
      prediction: predictedEmission,
      notes: notes || "",
      timestamp: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(
      { message: "Activity logged successfully", saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activityLogs = await ActivityLog.find({ userId: user._id }).sort({
      timestamp: -1,
    });
    return NextResponse.json({ activityLogs });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
