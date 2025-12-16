import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import API from "@/api/axios"
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [token, setToken] = useState("") // <-- store token in state
  const location = useLocation()
const navigate = useNavigate()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const t = params.get("token")
    setToken(t) // <-- set token state
    console.log("Token:", t)
  }, [location])

  const checkStrength = (password) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      return "Strong"
    } else if (password.length >= 6) {
      return "Medium"
    } else if (password.length > 0) {
      return "Weak"
    } else {
      return ""
    }
  }

  const handleNewPasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)
    setPasswordStrength(checkStrength(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      await showError("Passwords do not match!")
      return
    }
    const confirm = await showConfirm("Are you sure to change your password?");
    if (!confirm.isConfirmed) return;

    try {
       await API.post(`/auth/reset-password`, {
        token:token,
        new_password:confirmPassword,
      })
         navigate("/")
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below and confirm it to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 relative">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {passwordStrength && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === "Strong"
                        ? "text-green-600"
                        : passwordStrength === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStrength} password
                  </p>
                )}
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
