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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const updatedLink = await request.json()
  const links = await readLinksFile()
  const index = links.findIndex((link: any) => link.id === id)
  if (index !== -1) {
    links[index] = { ...links[index], ...updatedLink }
    await writeLinksFile(links)
    return NextResponse.json(links[index])
  }
  return NextResponse.json({ error: "Link not found" }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const links = await readLinksFile()
  const filteredLinks = links.filter((link: any) => link.id !== id)
  if (filteredLinks.length < links.length) {
    await writeLinksFile(filteredLinks)
    return NextResponse.json({ message: "Link deleted" })
  }
  return NextResponse.json({ error: "Link not found" }, { status: 404 })
}

