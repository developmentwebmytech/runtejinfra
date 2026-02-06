"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { motion,  } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Key, LogOut } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isHovering, setIsHovering] = useState(false)

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
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[350px] shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-gray-800">
                Not Logged In
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link href="/login">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                  asChild
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Go to Login
                  </motion.div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <Card className="w-[400px] sm:w-[450px] shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-500" /> Profile
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {session.user?.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email / Phone</p>
                  <p className="font-medium text-gray-800">
                    {session.user?.email  || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Key className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-800">
                    {session.user?.role || "user"}
                  </p>
                </div>
              </div>
            </motion.div>

           

            <div className="flex flex-col gap-3 pt-4">

               <Link href="/dashboard/profile/edit">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Edit Profile
              </Button>
            </Link>
            
              <Link href="/dashboard/profile/change-password">
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
                  asChild
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Key className="w-4 h-4 mr-2" /> Change Password
                  </motion.div>
                </Button>
              </Link>

              <Button
                onClick={() => signOut()}
                className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </motion.div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}