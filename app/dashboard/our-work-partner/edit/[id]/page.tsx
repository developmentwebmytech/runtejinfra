"use client"

import { PartnerForm } from "@/components/partner-form"

export default function EditPartnerPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8 md:p-0 animate-in slide-in-from-right duration-500 ease-out">
        <PartnerForm partnerId={params.id} />
      </div>
    </div>
  )
}
