"use client"

import { FirmForm } from "@/components/firm-form"

export default function AddOurFirmPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full  animate-in slide-in-from-right duration-500">
        <FirmForm />
      </div>
    </div>
  )
}
