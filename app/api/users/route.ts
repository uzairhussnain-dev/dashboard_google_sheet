import { NextResponse } from "next/server";
import { sheets } from "../../lib/googleSheets";

const spreadsheetId = "";

export async function GET() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "users!A2:E",
  });

  const data = response.data.values || [];

  return NextResponse.json({ data });
}