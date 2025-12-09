import React, { useState } from "react"
import { UserCircle, LogOut, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../store/Slices/AuthSlice"

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    navigate("/userprofile")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" className="p-2">
        <UserCircle className="h-6 w-6" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={handleProfileClick}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <User className="inline-block mr-2 h-4 w-4" />
            User Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="inline-block mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

