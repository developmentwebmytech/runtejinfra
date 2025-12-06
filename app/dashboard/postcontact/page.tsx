"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"

interface PostData {
  _id: string
  instagram: string
  twitter: string
  whatsapp: string
  facebook: string
  linkedin: string
  mapUrl: string
  phone: string
}

export default function ContactPostAdmin() {
  const [data, setData] = useState<PostData | null>(null)
  const [saving, setSaving] = useState(false)

  /* load once */
  useEffect(() => {
    fetch("/api/contactpost")
      .then(r => r.json())
      .then(setData)
      .catch(() => alert("Load failed"))
  }, [])

  if (!data) return <p className="p-4 text-center">Loading…</p>
  async function save() {
    setSaving(true)
    const res = await fetch("/api/contactpost", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    setSaving(false)

    if (res.ok) {
      toast.success("Contact info post successfully")
    } else {
      toast.error("Failed to post")
    }
  }

  /* one small helper */
  const Field = (
    name: keyof PostData,
    label: string,
    type: React.HTMLInputTypeAttribute = "text",
  ) => (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        value={data[name] as string}
        onChange={e => setData({ ...data, [name]: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  )

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        save()
      }}
      className="mx-auto mt-8 max-w-md space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-center mb-4">Contact Settings</h2>

      {Field("phone", "Phone", "tel")}
      {Field("mapUrl", "Google Maps URL", "url")}
      {Field("instagram", "Instagram", "url")}
      {Field("twitter", "Twitter / X", "url")}
      {Field("whatsapp", "WhatsApp", "url")}
      {Field("facebook", "Facebook", "url")}
      {Field("linkedin", "LinkedIn", "url")}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  )
}
