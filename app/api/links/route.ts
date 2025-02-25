import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "links.json")

async function readLinksFile() {
  const data = await fs.readFile(dataFilePath, "utf8")
  return JSON.parse(data)
}

async function writeLinksFile(links: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2))
}

export async function GET() {
  const links = await readLinksFile()
  return NextResponse.json(links)
}

export async function POST(request: Request) {
  const newLink = await request.json()
  const links = await readLinksFile()
  links.push(newLink)
  await writeLinksFile(links)
  return NextResponse.json(newLink, { status: 201 })
}

export async function PUT(request: Request) {
  const updatedLinks = await request.json()
  await writeLinksFile(updatedLinks)
  return NextResponse.json({ message: "Links updated successfully" })
}

