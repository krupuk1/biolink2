import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const settingsFilePath = path.join(process.cwd(), "data", "settings.json")

async function readSettingsFile() {
  const data = await fs.readFile(settingsFilePath, "utf8")
  return JSON.parse(data)
}

async function writeSettingsFile(settings: any) {
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2))
}

export async function GET() {
  try {
    const settings = await readSettingsFile()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error reading settings:", error)
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedSettings = await request.json()
    await writeSettingsFile(updatedSettings)
    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

