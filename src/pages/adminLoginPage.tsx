import { useState } from "react";
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import DragCaptcha from "../comps/sharedComps/DragCaptcha";
import mainAxios from "../comps/Instance/mainAxios";
import { Logout_action_admin } from "../app/utlis/SharedUtilities";


type FormErrors = {
  username?: string;
  password?: string;
  general?: string;
  captcha?: string;
};

export default function SecureAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [resetCaptcha, setResetCaptcha] = useState(false);

  // Security enhancements
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (/[^a-zA-Z0-9_-]/.test(username)) {
      newErrors.username = "Username contains invalid characters";
    }

    // if (!password) {
    //   newErrors.password = "Password is required";
    // } else if (password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters";
    // } else if (!/[A-Z]/.test(password)) {
    //   newErrors.password = "Password must contain at least one uppercase letter";
    // } else if (!/[0-9]/.test(password)) {
    //   newErrors.password = "Password must contain at least one number";
    // } else if (!/[^A-Za-z0-9]/.test(password)) {
    //   newErrors.password = "Password must contain at least one special character";
    // }

    if (!captchaVerified) {
      newErrors.captcha = "Please complete the CAPTCHA verification";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    // Check if account is locked
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setErrors({
        general: `Account temporarily locked. Please try again in ${remainingTime} minutes.`
      });
      return;
    }

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      console.log("Login attempted", { username, password, rememberMe });

      mainAxios.post("login/", {
        "username": username,
        "password": password,
      })
        .then(response => {
          // Reset attempts on success
          setLoginAttempts(0);
          setLockoutTime(null);

          // Handle successful login
          const token = response.data.access;
          const refresh = response.data.refresh;
          // console.log("Login successful", token);
          Logout_action_admin()
          // Store token and user info
          if (response.data.user_type !== 'public') {
            if (rememberMe) {
              localStorage.setItem("authToken", token);
              localStorage.setItem("refresh", refresh);
              localStorage.setItem("userInfo", JSON.stringify({
                "username": response.data.username,
                "email": response.data.email,
                "first_name": response.data.first_name,
                "last_name": response.data.last_name || '',
                "id": response.data.id,
                "type": response.data.user_type == 'public' ? 'user' : response.data.user_type,
              }));
            } else {
              // Use sessionStorage if "Remember me" is not checked
              sessionStorage.setItem("authToken", token);
              sessionStorage.setItem("refresh", refresh);
              sessionStorage.setItem("userInfo", JSON.stringify({
                "username": response.data.username,
                "email": response.data.email,
                "first_name": response.data.first_name,
                "last_name": response.data.last_name || '',
                "id": response.data.id,
                "type": response.data.user_type == 'public' ? 'user' : response.data.user_type,
              }));
            }
            window.location.href = "/admin/dashboard"; // Reload the page to reflect changes
          } else {
            setErrors({ general: "You do not have admin access." });
            window.location.href = "/"; // Redirect to user side
            return;
          }
        })
        .catch(error => {
          console.error("Login failed", error);

          // Handle login failure
          const attemptsRemaining = MAX_LOGIN_ATTEMPTS - (loginAttempts + 1);

          if (attemptsRemaining > 0) {
            setErrors({
              general: `Invalid credentials. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining.`
            });
          } else {
            // Lock the account
            const lockoutEnd = Date.now() + LOCKOUT_DURATION;
            setLockoutTime(lockoutEnd);
            setErrors({
              general: `Too many failed attempts. Account locked for 5 minutes.`
            });
          }

          setLoginAttempts(prev => prev + 1);
          // Reset CAPTCHA on failed login
          setResetCaptcha(prev => !prev);
          setCaptchaVerified(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleInputChange = (
    field: keyof FormErrors,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
    if (errors[field] || errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Security Badge */}
        <div className="flex justify-end mb-2">
          <div className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Secure Connection
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Security Header */}
          <div className="bg-primary text-white px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span className="font-medium">DHP - Portal</span>
              </div>
              <span
                onClick={() => window.location.href = "/"}
                className="text-xs cursor-pointer hover:underline opacity-80"
              >
                Users Side
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter admin username"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                  value={username}
                  onChange={(e) => handleInputChange('username', e.target.value, setUsername)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                  maxLength={20}
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                    minLength={8}
                    maxLength={32}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* CAPTCHA Verification */}
              <div>
                <DragCaptcha
                  onVerify={setCaptchaVerified}
                  resetTrigger={resetCaptcha}
                />
                {errors.captcha && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.captcha}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                    Remember this device
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Sign In Securely'
                )}
              </button>
            </div>

            {/* Security Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p className="flex items-center justify-center">
                  <Shield className="w-3 h-3 mr-1" />
                  All login activities are logged and monitored
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Digital Heritage Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}