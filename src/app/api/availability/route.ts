import { NextRequest, NextResponse } from "next/server";
import { getAvailableTimes } from "@/lib/funnel-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("from_date");
    const toDate = searchParams.get("to_date") || fromDate;

    if (!fromDate) {
      return NextResponse.json(
        { error: "from_date parameter is required." },
        { status: 400 }
      );
    }

    const data = await getAvailableTimes(fromDate, toDate!);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
