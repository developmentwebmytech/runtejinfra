"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

if (status === "loading") {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

  if (!session) return <p>Not logged in</p>

  const saveProfile = async () => {
    if (!name || !email) {
      toast.error("Name and email are required")
      return
    }

    setLoading(true)

    const res = await fetch("/api/admin/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      await update({ name, email })
     toast.success("Profile Update Successfully")
     signOut()
    } else {
      toast.error("Failed to update profile")
    }
    

    setLoading(false)
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full border p-2 rounded"
          />
        </div>

        <Button onClick={saveProfile} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button
          onClick={() => signOut()}
          variant="destructive"
          className="w-full"
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  )
}
