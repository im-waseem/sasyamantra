"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  }, [type]);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (type === "register") {
      if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
      if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
      if (!/\d/.test(password)) return "Password must contain a number";
    }
    return null;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    if (type === "register") {
      if (!formData.fullName.trim()) errors.fullName = "Full name is required";
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (type === "login") {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) {
          setError(loginError.message.includes("Invalid login credentials")
            ? "Invalid email or password"
            : loginError.message
          );
        } else if (data.user) {
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => router.push(redirectUrl), 1000);
        }

      } else {
        // Registration
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(redirectUrl)}`,
          },
        });

        if (signUpError) {
          setError(signUpError.message.includes("User already registered")
            ? "An account with this email already exists"
            : signUpError.message
          );
        } else if (signUpData.user) {
          const userId = signUpData.user.id;
          console.log("Creating profile for user ID:", userId);

          try {
            // Insert profile safely
            const { error: profileError } = await supabase.from("profiles").insert({
              id: userId,
              full_name: formData.fullName,
            });

            if (profileError) {
              console.error("Profile insert error:", profileError);
              setError(
                "Failed to create user profile. Check Row-Level Security policies."
              );
            } else {
              console.log("Profile created successfully");
              setSuccess("Registration successful! Check your email for confirmation.");
              setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
            }
          } catch (err: any) {
            console.error("Unexpected profile insert error:", err);
            setError("Unexpected error while creating profile. Please try again.");
          }
        }
      }
    } catch (err: any) {
      console.error("Unexpected auth error:", err);
      setError("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {type === "login" ? "Sign in to your account" : "Join us today"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => handleInputChange("fullName", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      validationErrors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {validationErrors.fullName && <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    validationErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => handleInputChange("password", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    validationErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder={type === "login" ? "Enter password" : "Create password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
            </div>

            {type === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange("confirmPassword", e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      validationErrors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
            >
              {loading ? "Please wait..." : type === "login" ? "Sign In" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {type === "login" ? (
              <>
                Don't have an account? <Link href="/register" className="text-green-600 hover:underline">Register</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href="/login" className="text-green-600 hover:underline">Login</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
