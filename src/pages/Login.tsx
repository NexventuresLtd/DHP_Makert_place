import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mainAxios from "../comps/Instance/mainAxios";

export default function DHPLoginPage() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setError("");
    
    mainAxios.post("login/", {
      "username": email,
      "password": password,
    })
    .then(response => {
      localStorage.setItem("authToken", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("userInfo", JSON.stringify({
        "username": response.data.username,
        "email": response.data.email,
        "first_name": response.data.first_name,
        "last_name": response.data.last_name || '',
        "id": response.data.id,
        "type": response.data.user_type === 'public' ? 'user' : response.data.user_type,
      }));
      window.location.href = "/";
    })
    .catch(err => {
      setError("Invalid username or password");
      console.error("Login failed", err);
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left side - Background */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-[url('https://64.media.tumblr.com/ef0f77e9dadd07d7c0afdd31569c6c1d/tumblr_inline_pk1sznOLUk1slghul_500.gif')] bg-cover bg-no-repeat bg-blend-overlay bg-white/60 backdrop-blur-3xl">
        <div className="max-w-md p-8">
          <h2 className="text-3xl font-extrabold text-gray-600 mb-4">Digital Heritage Platform</h2>
          <p className="text-gray-500 font-medium">
            Preserving cultural heritage through digital innovation and community collaboration.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-[url('/images/research.png')] bg-cover bg-no-repeat bg-blend-overlay bg-white/95 backdrop-blur-3xl">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-0">
            <img 
              src="/logos/logo-circle.png" 
              alt="Logo" 
              className="h-64 w-64"
            />
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-center text-gray-500 mb-6">Sign in to your account</p>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your username or email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button className="text-sm text-primary hover:text-primary/80">
                Forgot password?
              </button>
            </div>
            <p className="p-2 w-full text-sm text-gray-600 font-medium cursor-pointer hover:underline text-center" onClick={() => window.location.href = "/"}>Back to Home</p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200 mt-4">
              Don't have an account?{' '}
              <button 
                className="text-primary font-medium hover:text-primary/80"
                onClick={() => nav("/register")}
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}