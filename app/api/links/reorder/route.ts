import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "links.json")

async function writeLinksFile(links: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2))
}

export async function PUT(request: Request) {
  const newOrder = await request.json()
  await writeLinksFile(newOrder)
  return NextResponse.json({ message: "Links reordered successfully" })
}

