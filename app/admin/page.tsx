"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Trash2, Eye, EyeOff } from "lucide-react"

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

export default function AdminPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [settings, setSettings] = useState<Settings>({ title: "", subtitle: "", profileImage: "" })

  useEffect(() => {
    fetchLinks()
    fetchSettings()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      if (!response.ok) throw new Error("Failed to fetch links")
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error("Error fetching links:", error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (!response.ok) throw new Error("Failed to fetch settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLink, id: uuidv4(), hidden: false }),
      })
      if (!response.ok) throw new Error("Failed to add link")
      setNewLink({ title: "", url: "" })
      fetchLinks()
    } catch (error) {
      console.error("Error adding link:", error)
    }
  }

  const updateLink = async (id: string, updatedLink: Partial<LinkItem>) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLink),
      })
      if (!response.ok) throw new Error("Failed to update link")
      fetchLinks()
    } catch (error) {
      console.error("Error updating link:", error)
    }
  }

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete link")
      fetchLinks()
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }

  const moveLink = async (id: string, direction: "up" | "down") => {
    const index = links.findIndex((link) => link.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < links.length - 1)) {
      const newLinks = [...links]
      const [movedLink] = newLinks.splice(index, 1)
      newLinks.splice(direction === "up" ? index - 1 : index + 1, 0, movedLink)

      try {
        const response = await fetch("/api/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLinks),
        })
        if (!response.ok) throw new Error("Failed to reorder links")
        setLinks(newLinks)
      } catch (error) {
        console.error("Error reordering links:", error)
      }
    }
  }

  const toggleHidden = async (id: string) => {
    const link = links.find((link) => link.id === id)
    if (link) {
      await updateLink(id, { hidden: !link.hidden })
    }
  }

  const updateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) throw new Error("Failed to update settings")
      alert("Settings updated successfully")
    } catch (error) {
      console.error("Error updating settings:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Settings</h2>
        <form onSubmit={updateSettings} className="space-y-2">
          <input
            type="text"
            placeholder="Biolink Title"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Profile Image URL"
            value={settings.profileImage}
            onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
            Update Settings
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-2">Links</h2>
      <form onSubmit={addLink} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Title"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          className="flex-grow p-2 border rounded"
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="flex-grow p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Link
        </button>
      </form>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={link.id} className="bg-white p-4 rounded shadow flex items-center space-x-2">
            <div className="flex-grow flex space-x-2">
              <input
                type="text"
                value={link.title}
                onChange={(e) => updateLink(link.id, { title: e.target.value })}
                className="flex-grow p-2 border rounded"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                className="flex-grow p-2 border rounded"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => moveLink(link.id, "up")}
                disabled={index === 0}
                className="p-2 bg-gray-300 text-gray-700 rounded"
              >
                ↑
              </button>
              <button
                onClick={() => moveLink(link.id, "down")}
                disabled={index === links.length - 1}
                className="p-2 bg-gray-300 text-gray-700 rounded"
              >
                ↓
              </button>
              <button onClick={() => toggleHidden(link.id)} className="p-2 bg-gray-300 text-gray-700 rounded">
                {link.hidden ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button onClick={() => deleteLink(link.id)} className="p-2 bg-red-500 text-white rounded">
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

