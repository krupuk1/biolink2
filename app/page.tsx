import fs from "fs/promises"
import path from "path"
import Link from "next/link"
import Image from "next/image"

interface LinkItem {
  id: string
  title: string
  url: string
  hidden: boolean
}

interface Settings {
  title: string
  subtitle: string
  profileImage: string
}

async function getLinks(): Promise<LinkItem[]> {
  const filePath = path.join(process.cwd(), "data", "links.json")
  const jsonData = await fs.readFile(filePath, "utf8")
  return JSON.parse(jsonData)
}

async function getSettings(): Promise<Settings> {
  const filePath = path.join(process.cwd(), "data", "settings.json")
  const jsonData = await fs.readFile(filePath, "utf8")
  return JSON.parse(jsonData)
}

export default async function Home() {
  const links = await getLinks()
  const settings = await getSettings()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Image
            src={settings.profileImage || "/placeholder.svg"}
            alt="Profile"
            width={100}
            height={100}
            className="mx-auto rounded-full"
          />
          <h1 className="text-3xl font-bold text-white mb-2">{settings.title}</h1>
          <p className="text-xl text-white mb-8">{settings.subtitle}</p>
        </div>
        {links
          .filter((link) => !link.hidden)
          .map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="block w-full p-4 text-center bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
            >
              {link.title}
            </Link>
          ))}
      </div>
    </main>
  )
}

export const revalidate = 0

