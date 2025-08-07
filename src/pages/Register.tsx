import { useState } from "react";
import { Eye, EyeOff, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
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
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    if (stepNumber === 1) {
      if (!fname.trim()) newErrors.fname = "First name is required";
      if (!lname.trim()) newErrors.lname = "Last name is required";
    } else if (stepNumber === 2) {
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
    } else if (stepNumber === 3) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleRegister = () => {
    if (!validateStep(step)) return;

    setIsLoading(true);
    setError("");

    mainAxios.post("register/", {
      "first_name": fname,
      "last_name": lname,
      "username": uname,
      "email": email,
      "password": password
    })
      .then(() => {
        nav("/login");
      })
      .catch(err => {
        if (err.response?.data?.email) {
          setErrors(prev => ({ ...prev, email: "Email already exists" }));
          setStep(2); // Go back to email step if email exists
        } else {
          setError("Registration failed. Please try again.");
        }
        console.error("Registration failed", err);
      })
      .finally(() => setIsLoading(false));
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

  // Progress steps
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Account Info" },
    { number: 3, title: "Password" }
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left side - Background */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-[url('https://64.media.tumblr.com/ef0f77e9dadd07d7c0afdd31569c6c1d/tumblr_inline_pk1sznOLUk1slghul_500.gif')] bg-cover bg-no-repeat bg-blend-overlay bg-white/60 backdrop-blur-3xl">
        <div className="max-w-md p-8">
          <h2 className="text-3xl font-extrabold text-gray-600 mb-4">Digital Heritage Platform</h2>
          <p className="text-gray-500 font-medium">
            Join our community to preserve cultural heritage through digital innovation.
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full md:w-1/2 flex justify-center p-6 bg-[url('/images/research.png')] bg-cover bg-no-repeat bg-blend-overlay bg-white/95 backdrop-blur-3xl">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src="/logos/logo-circle.png" 
              alt="Logo" 
              className="h-54 w-54"
            />
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-4 px-4">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.number ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.number}
                </div>
                <span className={`text-xs mt-1 ${step >= s.number ? "text-primary font-medium" : "text-gray-500"}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Create an Account</h1>
              <p className="text-center text-gray-500 ">Step {step} of 3</p>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border ${errors.fname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      value={fname}
                      onChange={(e) => handleInputChange('fname', e.target.value, setFname)}
                      placeholder="Enter your first name"
                    />
                    {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border ${errors.lname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      value={lname}
                      onChange={(e) => handleInputChange('lname', e.target.value, setLname)}
                      placeholder="Enter your last name"
                    />
                    {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border ${errors.uname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      value={uname}
                      onChange={(e) => handleInputChange('uname', e.target.value, setUname)}
                      placeholder="Choose a username"
                    />
                    {errors.uname && <p className="text-red-500 text-xs mt-1">{errors.uname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                        placeholder="Create a password"
                      />
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                  </div>
                </div>
              )}
            </div>

            <p className="p-2 w-full text-sm text-gray-600 font-medium cursor-pointer hover:underline text-center" onClick={() => window.location.href = "/"}>Back to Home</p>
            
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className={`flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 ${step > 1 ? 'flex-1' : 'w-full'}`}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Sign Up
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500 pt-4 mb-20 border-t border-gray-200 mt-4">
              Already have an account?{' '}
              <button 
                className="text-primary font-medium hover:text-primary/80"
                onClick={() => nav("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}