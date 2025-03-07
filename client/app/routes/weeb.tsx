import React, { useState } from "react";
import { motion } from "framer-motion";
import { login, signup } from "~/api/user";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

type FormState = "signup" | "signin";
interface FormEvent {
  target: {
    name: string;
    value: string;
  };
}

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>("signin");
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSwitch = (newState: FormState) => {
    if (newState !== formState) {
      setIsReversed(!isReversed);
      setFormState(newState);
    }
  };

  const handlogindata = (e: React.ChangeEvent<HTMLInputElement>) => {
    setloginData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignupdata = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await signup(signupData);
      
      if (!response || response.error) {
        toast.error(response?.error || "Signup failed. Please try again.");
        return;
      }

      toast.success("Signup successful!");
      navigate(`/user/${response.user.name}`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during signup");
      console.error("Signup error:", error);
    }
  };

  const handlelogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login(loginData);

      if (!response || response.error) {
        toast.error(response?.error || "Invalid credentials");
        return;
      }

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      toast.success("Login successful!");
      navigate(`/user/${response.user.name}`);
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  // Rest of the JSX remains the same
  return (
    <>
      <title>Animadom | Getstarted</title>

      <div className="flex min-h-screen w-full items-center justify-center p-4 ">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
          <motion.div
            className="flex w-full flex-col lg:flex-row"
            initial={false}
            animate={{
              x: isReversed ? "0%" : "0%",
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
          >
            {/* Container for the forms and image */}
            <div className="flex w-full flex-col lg:flex-row">
              {/* Image section - update the classes and container */}
              <motion.div
                className="h-[800px] overflow-hidden w-full lg:w-1/2"
                initial={false}
                animate={{
                  x: isReversed ? "100%" : "0%",
                  scale: isReversed ? 1.02 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1.2,
                }}
                style={{
                  position: isReversed ? "absolute" : "relative",
                  zIndex: 10,
                }}
              >
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-br mix-blend-multiply"></div>
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Authentication visual"
                    className="h-full object-cover object-center blur-[3px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <h1 className="mb-4 text-2xl lg:text-4xl font-bold text-black">
                        {formState === "signin"
                          ? "Welcome Back!"
                          : "Join Our Community"}
                      </h1>
                      <p className="text-sm lg:text-lg text-purple-400/90">
                        {formState === "signin"
                          ? "Sign in to access your account and continue your journey with us."
                          : "Create an account to get started and explore all our features."}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Form container - update the classes */}
              <div className="flex w-full lg:w-1/2 items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                  {/* Sign In Form */}
                  {formState === "signin" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full"
                    >
                      <h2 className="mb-2 text-3xl font-bold">Sign In</h2>
                      <p className="mb-6 ">
                        Enter your credentials to access your account
                      </p>
                      <form className="space-y-4" onSubmit={handlelogin}>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                          >
                            Email
                          </label>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="your.email@example.com"
                              value={loginData.email}
                              onChange={handlogindata}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium"
                          >
                            Password
                          </label>
                          <div className="flex items-center justify-between">
                            <a
                              href="#"
                              className="text-sm font-medium text-violet-600 hover:text-violet-500"
                            >
                              Forgot password?
                            </a>
                          </div>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="••••••••"
                              value={loginData.password}
                              onChange={handlogindata}
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                          >
                            Sign In
                          </button>
                        </div>
                      </form>
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-600">
                            Google
                          </button>
                          <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-600">
                            Facebook
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Don't have an account?{" "}
                          <button
                            onClick={() => handleSwitch("signup")}
                            className="font-medium text-violet-600 hover:text-violet-500"
                          >
                            Sign Up
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Sign Up Form */}
                  {formState === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full"
                    >
                      <h2 className="mb-2 text-3xl font-bold ">
                        Create Account
                      </h2>
                      <p className="mb-6  ">
                        Sign up to get started with your new account
                      </p>
                      <form className="space-y-4" onSubmit={handlesignup}>
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium"
                          >
                            Full Name
                          </label>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="John Doe"
                              value={signupData.name}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="signup-email"
                            className="block text-sm font-medium"
                          >
                            Email
                          </label>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="email"
                              id="signup-email"
                              name="email"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="your.email@example.com"
                              value={signupData.email}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="signup-password"
                            className="block text-sm font-medium"
                          >
                            Password
                          </label>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="password"
                              id="signup-password"
                              name="password"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="••••••••"
                              value={signupData.password}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium"
                          >
                            Confirm Password
                          </label>
                          <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                            <input
                              type="password"
                              id="confirm-password"
                              name="confirmPassword"
                              className="block w-full border-0 px-4 py-3 focus:outline-none focus:ring-0"
                              placeholder="••••••••"
                              value={signupData.confirmPassword}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                          <label htmlFor="terms" className="ml-2 block text-sm">
                            I agree to the{" "}
                            <a
                              href="#"
                              className="font-medium text-violet-600 hover:text-violet-500"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="font-medium text-violet-600 hover:text-violet-500"
                            >
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                          >
                            Create Account
                          </button>
                        </div>
                      </form>
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                              Or sign up with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-600">
                            Google
                          </button>
                          <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-600">
                            Facebook
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Already have an account?{" "}
                          <button
                            onClick={() => handleSwitch("signin")}
                            className="font-medium text-violet-600 hover:text-violet-500"
                          >
                            Sign In
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
