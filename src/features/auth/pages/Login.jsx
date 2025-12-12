import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Landing from '../components/Landing'
import API from '@/api/axios'

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("login")
 const [loginData, setLoginData] = useState({
  employee_id: "",
  password: "",
});

const [signupData, setSignupData] = useState({
  employee_id: "",
  password: "",
});


  const API_URL = import.meta.env.VITE_API_URL

 const handleLoginChange = (e) => {
  setLoginData({ ...loginData, [e.target.id]: e.target.value });
};

const handleSignupChange = (e) => {
  setSignupData({ ...signupData, [e.target.id]: e.target.value });
};

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API_URL}/auth/register`, signupData);

    if (res.status === 200 || res.status === 201) {
      alert("Registration successful! Please log in.");

      // reset signup fields
      setSignupData({ employee_id: "", password: "" });

      // switch to login tab
      setActiveTab("login");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed.");
  }
};


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post(`/auth/signin/`, {
      employee_id: loginData.employee_id,
      password: loginData.password,
    });

    if (res.status === 200) {
      const { access_token, hr_role,workstation_hold } = res.data;

    localStorage.removeItem("access_token");
    localStorage.removeItem("hr_role");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("workstation_hold");

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("hr_role", hr_role);
    localStorage.setItem("employee_id", loginData.employee_id);
    localStorage.setItem("workstation_hold", workstation_hold);


      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  } catch (error) {
    if (error.response?.status === 403) {
      alert(error.response.data.detail);
    } else {
      alert(error.response?.data?.detail || "Login failed.");
    }
  }
};


  const inputClassName = "bg-[#f3f7f3] border-[#2d5f2e]/20 focus-visible:!border-[#2d5f2e]"
  const buttonClassName = "w-full bg-gradient-to-r from-[#2d5f2e] to-[#3a7a3c] hover:from-[#3a7a3c] hover:to-[#4a9a4d] text-white shadow-md shadow-[#2d5f2e]/20 transition-all"
  const tabTriggerClassName = "data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2d5f2e] data-[state=active]:to-[#3a7a3c] data-[state=active]:text-white"

  return (
    <div className='flex h-[100vh] w-full'>
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2d5f2e] via-[#3a7a3c] to-[#4a9a4d] p-12 flex-col justify-center text-white">
        <Landing />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Get Started</h2>
            <p className='text-gray-600'>Create an account or sign in to continue</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6 bg-white border border-[#2d5f2e]/15 p-1">
              <TabsTrigger value="login" className={tabTriggerClassName}>
                Log in
              </TabsTrigger>
              <TabsTrigger value="signup" className={tabTriggerClassName}>
                Sign up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
  <Label htmlFor="employee_id">Employee ID</Label>
  <Input
    id="employee_id"
    value={loginData.employee_id}
    onChange={handleLoginChange}
    className={inputClassName}
    autoComplete="off"
    required
  />

  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    value={loginData.password}
    onChange={handleLoginChange}
    className={inputClassName}
    required
  />

  <Button type="submit" className={buttonClassName}>Log in</Button>
</form>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
  <Label htmlFor="employee_id">Employee ID</Label>
  <Input
    id="employee_id"
    value={signupData.employee_id}
    onChange={handleSignupChange}
    className={inputClassName}
    required
  />

  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    value={signupData.password}
    onChange={handleSignupChange}
    className={inputClassName}
    required
  />

  <Button type="submit" className={buttonClassName}>Sign up</Button>
</form>

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Login