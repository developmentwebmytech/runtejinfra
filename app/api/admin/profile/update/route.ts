import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import  User  from "@/lib/models/User"
import {connectDB} from "@/lib/mongodb"

export async function PUT(req: Request) {
  await connectDB()

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, email } = await req.json()

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    )
  }

  await User.findOneAndUpdate(
    { email: session.user.email }, // find current user
    { name, email },               // update both
    { new: true }
  )

  return NextResponse.json({ success: true })
}

