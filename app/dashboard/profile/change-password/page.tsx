"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

/* 🔴 MOVED OUTSIDE — THIS FIXES THE FOCUS BUG */
const PasswordInput = ({
  label,
  name,
  value,
  showPassword,
  onToggleShow,
  onChange,
  loading,
}: {
  label: string
  name: string
  value: string
  showPassword: boolean
  onToggleShow: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        disabled={loading}
        className="pr-10 border-gray-300"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        disabled={loading}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
)

export default function ChangePasswordPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full"
        />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/admin/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed")
        return
      }

      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => router.push("/dashboard/profile"), 2000)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" /> Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              showPassword={showPasswords.current}
              onToggleShow={() =>
                setShowPasswords(p => ({ ...p, current: !p.current }))
              }
              onChange={handleInputChange}
              loading={loading}
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              showPassword={showPasswords.new}
              onToggleShow={() =>
                setShowPasswords(p => ({ ...p, new: !p.new }))
              }
              onChange={handleInputChange}
              loading={loading}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              showPassword={showPasswords.confirm}
              onToggleShow={() =>
                setShowPasswords(p => ({ ...p, confirm: !p.confirm }))
              }
              onChange={handleInputChange}
              loading={loading}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Success!</p>}

            <Button type="submit" disabled={loading} className="w-full">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
