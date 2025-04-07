// src/app/api/couchdb/route.ts
import { NextResponse } from "next/server";

// It's best to store credentials and DB details in environment variables.

export async function GET() {
  const username = "admin";
  const password = "admin";
  const dbName = "terminal_images";
  const authHeader = "Basic " + btoa(`${username}:${password}`);
  const url = `http://129.114.26.25:32000/${dbName}/_all_docs?include_docs=true`;
  try {
    const res = await fetch(url, {headers: {
        Authorization: authHeader,
      }});
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data. Status: ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from CouchDB:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
