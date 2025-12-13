import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Landing from '../components/Landing'
import API from '@/api/axios'
import { Chrome, Loader2, Eye, EyeOff } from "lucide-react"
import APIV2 from '@/api/axiosv2'

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    employee_id: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    employee_id: "",
    password: "",
    confirmPassword: "",
  })

  const API_URL = import.meta.env.VITE_API_URL
  const BASE_URL = window.location.origin;


  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value })
  }

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setIsLoading(true)

    try {
      const res = await APIV2.post(`/auth/register`, {
        employee_id: signupData.employee_id,
        password: signupData.password,
      })

      if (res.status === 200 || res.status === 201) {
        alert("Registration successful! Please log in.")
        setSignupData({ employee_id: "", password: "", confirmPassword: "" })
        setIsSignUp(false)
      }
      if (res.status === 400) {

        setIsLoading(false)
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await APIV2.post(`/auth/signin/`, {
        employee_id: loginData.employee_id,
        password: loginData.password,
      })

      if (res.status === 200) {
        const { access_token, hr_role, workstation_hold, f_name, l_name } = res.data

        localStorage.setItem("access_token", access_token)
        localStorage.setItem("hr_role", hr_role)
        localStorage.setItem("employee_id", loginData.employee_id)
        localStorage.setItem("workstation_hold", workstation_hold)
        localStorage.setItem("f_name", f_name)
        localStorage.setItem("l_name", l_name)

        setIsLoggedIn(true)
        navigate("/dashboard")
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d5f2e] via-[#3a7a3c] to-[#4a9a4d] animate-gradient-slow" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="relative z-10 p-12 flex flex-col justify-center text-white w-full">
          <Landing />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-500">
              {isSignUp ? "Sign up to get started" : "Sign in to your account"}
            </p>
          </div>

          <Card className="border border-gray-200/60 shadow-xl rounded-2xl backdrop-blur-sm bg-white/95 transition-all duration-300 hover:shadow-2xl">
            <CardContent className="pt-6 space-y-6">
              {isSignUp ? (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Employee ID */}
                  <div className="space-y-2 group">
                    <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700 group-focus-within:text-[#2d5f2e] transition-colors">
                      Employee ID
                    </Label>
                    <Input
                      id="employee_id"
                      value={signupData.employee_id}
                      onChange={handleSignupChange}
                      placeholder="Enter your employee ID"
                      required
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f2e]"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2 group relative">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 group-focus-within:text-[#2d5f2e] transition-colors">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a strong password"
                      required
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f2e] pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 group relative">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 group-focus-within:text-[#2d5f2e] transition-colors">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Re-enter your password"
                      required
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f2e] pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#2d5f2e] to-[#3a7a3c] hover:from-[#255227] hover:to-[#2d5f2e] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : "Create account"}
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-2">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-[#2d5f2e] font-medium hover:underline"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign in here
                    </button>
                  </div>

                  {/* Google Sign Up */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                    onClick={() =>
                    (window.location.href =
                      `${API_URL}/google-auth/google/login?redirect=${BASE_URL}/auth/google/callback/signup`)
                    }
                  >
                    <Chrome className="h-5 w-5 text-gray-700" />
                    Continue with Google
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Login Form unchanged, optional eye toggle can be added similarly */}
                  <div className="space-y-2 group">
                    <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700">
                      Employee ID
                    </Label>
                    <Input
                      id="employee_id"
                      value={loginData.employee_id}
                      onChange={handleLoginChange}
                      placeholder="Enter your employee ID"
                      autoComplete="off"
                      required
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f2e]"
                    />
                  </div>

                  <div className="space-y-2 group relative">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      required
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f2e] pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#2d5f2e] to-[#3a7a3c] hover:from-[#255227] hover:to-[#2d5f2e] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : "Sign in"}
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-2">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-[#2d5f2e] font-medium hover:underline"
                      onClick={() => setIsSignUp(true)}
                    >
                      Create new account
                    </button>
                  </div>

                  {/* Google Sign In */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                    onClick={() =>
                    (window.location.href =
                      `${API_URL}/google-auth/google/login?redirect=${BASE_URL}/auth/google/callback/signin`)
                    }
                  >
                    <Chrome className="h-5 w-5 text-gray-700" />
                    Continue with Google
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
