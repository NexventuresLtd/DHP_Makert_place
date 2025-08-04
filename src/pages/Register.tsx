import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mainAxios from "../comps/Instance/mainAxios";
type FormErrors = {
  fname?: string;
  lname?: string;
  uname?: string;
  email?: string;
  password?: string;
};

export default function DHPRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fname.trim()) {
      newErrors.fname = "First name is required";
    }

    if (!lname.trim()) {
      newErrors.lname = "Last name is required";
    }

    if (!uname.trim()) {
      newErrors.uname = "Username is required";
    } else if (uname.length < 3) {
      newErrors.uname = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      mainAxios.post("register/", {
        "first_name": fname,
        "last_name": lname,
        "username": uname,
        "email": email,
        "password": password
      })
        .then(response => {
          console.log("Registration successful", response.data);
          // Redirect to login or home page
          window.location.href = "/login";
        })
        .catch(error => {
          console.error("Registration failed", error);
          if (error.response) {
            // Handle specific error responses
            if (error.response.status === 400) {
              setErrors(prev => ({ ...prev, email: "Email already exists" }));
            } else {
              console.error("An unexpected error occurred", error.response.data);
            }
          }
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

  const nav = useNavigate()

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Background image and logo */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-repeat w-full h-full">
          <img src="logos/big-login.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right side - Register form */}
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

          <h1 className="text-2xl font-bold text-center mb-10">Join & Connect the Fastest Growing Online Community</h1>

          {/* Google sign in button */}
          {/* <button
            className="flex items-center justify-center w-full border border-gray-300 rounded-full py-3 px-4 mb-6 cursor-pointer hover:bg-gray-100"
            onClick={() => console.log("Google sign-in")}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google logo" className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-500">Sign up with Google</span>
          </button> */}

          {/* Register form */}
          <div className="space-y">
            {/* First Name */}
            <div>
              <label htmlFor="fname" className="text-gray-500 text-xs">First Name</label>
              <input
                id="fname"
                type="text"
                placeholder="Enter your first name"
                className={`w-full px-3 py-3 border-b focus:outline-none ${errors.fname ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                value={fname}
                onChange={(e) => handleInputChange('fname', e.target.value, setFname)}
              />
              {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lname" className="text-gray-500 text-xs">Last Name</label>
              <input
                id="lname"
                type="text"
                placeholder="Enter your last name"
                className={`w-full px-3 py-3 border-b focus:outline-none ${errors.lname ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                value={lname}
                onChange={(e) => handleInputChange('lname', e.target.value, setLname)}
              />
              {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="uname" className="text-gray-500 text-xs">Username</label>
              <input
                id="uname"
                type="text"
                placeholder="Choose a username"
                className={`w-full px-3 py-3 border-b focus:outline-none ${errors.uname ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                value={uname}
                onChange={(e) => handleInputChange('uname', e.target.value, setUname)}
              />
              {errors.uname && <p className="text-red-500 text-xs mt-1">{errors.uname}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-gray-500 text-xs">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-3 border-b focus:outline-none ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-gray-500 text-xs">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`w-full px-3 py-3 border-b focus:outline-none ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
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
              className="text-sm mt-4 text-gray-600 hover:text-green-900 ml-auto block"
              onClick={() => console.log("Forgot password")}
            >
              Forgot password?
            </button>

            <div className="flex mt-3 items-center justify-between">
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
                onClick={handleRegister}
                className="w-full bg-primary text-white py-3 px-4 rounded-full hover:bg-green-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2"
              >
                SIGN UP
              </button>
            </div>
          </div>

          {/* Login link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              className="text-sm font-medium cursor-pointer text-primary hover:text-green-800"
              onClick={() => nav("/login")}
            >
              Sign in
            </button>
          </div>
          <a href="/" className="text-sm w-fit bg-white absolute p-2 cursor-pointer text-primary font-medium text-center block">Back To Home</a>
        </div>
      </div>
    </div>
  );
}