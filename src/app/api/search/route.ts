import { NextRequest, NextResponse } from "next/server";
import { searchListings } from "@/lib/search.queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({
      company: [],
      datacenter: [],
      registrar: [],
      person: [],
      total: 0,
    });
  }

  const results = await searchListings(q);
  return NextResponse.json(results);
}
