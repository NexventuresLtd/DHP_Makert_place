import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mainAxios from "../comps/Instance/mainAxios";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function DHPLoginPage() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email or username is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 3) {
      // Accept either email format or username with at least 3 chars
      newErrors.email = "Please enter a valid email or username (min 3 characters)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log("Login attempted", { email, password, rememberMe });
      mainAxios.post("login/", {
        "username": email,
        "password": password,
      })
        .then(response => {
          // Handle successful login
          const token = response.data.access
          localStorage.setItem("authToken", token);
          localStorage.setItem("userInfo", JSON.stringify({
            "username": email,
            "type": "user",
          }));
          nav("/");
        })
        .catch(error => {
          console.error("Login failed", error);
          setErrors({ email: "Invalid Username or password", password: "Invalid Username or password" });
        });
    } else {
      console.log("Form has validation errors");
    }
  };

  const handleInputChange = (
    field: keyof FormErrors,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Background image and logo */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-repeat w-full h-full">
          <img src="logos/big-login.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-8 overflow-auto">
        <div className="w-full max-w-md">
          {/* Logo and header */}
          <div className="flex items-center justify-center mb-6 cursor-pointer" onClick={() => window.location.href = "/"}>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <img src="logos/logo-circle.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium">Digital Heritage</p>
              <p className="text-xs text-gray-500 font-medium">Preservationists platform</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-10">Welcome back to the DHP Community</h1>

          {/* Google sign in button */}
          <button
            className="flex items-center justify-center w-full border border-gray-300 rounded-full py-4 px-4 mb-6 cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Google sign-in")}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google logo" className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-500">Sign up with Google</span>
          </button>

          {/* Login form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="text-gray-500 text-xs">username</label>
              <input
                id="text"
                type="text"
                placeholder="johndadev"
                className={`w-full px-3 py-4 border-b focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-gray-500 text-xs">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 py-4 border-b focus:outline-none ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                    }`}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ?
                    <EyeOff size={20} className="text-gray-400" /> :
                    <Eye size={20} className="text-gray-400" />
                  }
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              className="text-sm text-gray-600 hover:text-green-900 ml-auto block"
              onClick={() => console.log("Forgot password")}
            >
              Forgot password?
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-green-500"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  id="remember-me"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-primary text-white py-4 px-4 rounded-full hover:bg-green-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2"
              >
                LOG IN
              </button>
            </div>
          </div>

          {/* Register link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">No Account yet? </span>
            <button
              className="text-sm cursor-pointer font-medium text-primary hover:text-green-800"
              onClick={() => nav("/register")}
            >
              Sign up
            </button>
          </div>
          <a href="/" className="text-sm w-fit bg-white absolute p-2 cursor-pointer text-primary font-medium text-center block">Back To Home</a>
        </div>
      </div>
    </div>
  );
}