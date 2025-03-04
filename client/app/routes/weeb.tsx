import React, { useState } from "react";
import { motion } from "framer-motion";

type FormState = "signup" | "signin";

const AuthForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>("signin");
  const [isReversed, setIsReversed] = useState<boolean>(false);

  const handleSwitch = (newState: FormState) => {
    if (newState !== formState) {
      setIsReversed(!isReversed);
      setFormState(newState);
    }
  };

  return (
    <>
      <title>AnimaDom | Get Started</title>
      <div className="flex min-h-screen w-full p-2 sm:p-4">
        <div className="m-auto flex w-full max-w-5xl overflow-hidden rounded-lg sm:rounded-2xl shadow-xl sm:shadow-2xl">
          <div className="relative flex w-full flex-col lg:flex-row">
            {/* Image section */}
            <motion.div
              className="h-[150px] sm:h-[200px] lg:h-auto lg:w-1/2"
              initial={false}
              animate={{
                x: isReversed ? "100%" : "0%",
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                position: isReversed ? "absolute" : "relative",
                zIndex: 10,
              }}
            >
              <div className="relative h-full w-full overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                <img
                  src="https://dummyimage.com/1000x1600"
                  alt="Authentication visual"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-3 sm:px-4 text-center lg:px-8"
                  >
                    <h1 className="mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-white lg:text-4xl">
                      {formState === "signin"
                        ? "Welcome Back!"
                        : "Join Our Community"}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/90 lg:text-lg">
                      {formState === "signin"
                        ? "Sign in to access your account and continue your journey with us."
                        : "Create an account to get started and explore all our features."}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Form container */}
            <div
              className={`flex w-full lg:w-1/2 items-center justify-center bg-white p-3 sm:p-4 lg:p-8 ${
                isReversed ? "order-first" : ""
              }`}
            >
              <div className="w-full max-w-md">
                {/* Sign In Form */}
                {formState === "signin" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <h2 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold text-gray-800">
                      Sign In
                    </h2>
                    <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
                      Enter your credentials to access your account
                    </p>
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                          <input
                            type="email"
                            id="email"
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
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
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="••••••••"
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
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                    <div className="mt-4 sm:mt-6">
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

                      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                        <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Google
                        </button>
                        <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Facebook
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-center">
                      <p className="text-xs sm:text-sm text-gray-600">
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
                    className="w-full h-full  "
                  >
                    <h2 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold text-gray-800">
                      Create Account
                    </h2>
                    <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
                      Sign up to get started with your new account
                    </p>
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                          <input
                            type="text"
                            id="name"
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="signup-email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                          <input
                            type="email"
                            id="signup-email"
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="signup-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                          <input
                            type="password"
                            id="signup-password"
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-1 rounded-md border border-gray-300 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-200">
                          <input
                            type="password"
                            id="confirm-password"
                            className="block w-full border-0 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0"
                            placeholder="••••••••"
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
                        <label
                          htmlFor="terms"
                          className="ml-2 block text-sm text-gray-700"
                        >
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
                          className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                    <div className="mt-4 sm:mt-6">
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

                      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                        <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Google
                        </button>
                        <button className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                          Facebook
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-center">
                      <p className="text-xs sm:text-sm text-gray-600">
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
        </div>
      </div>
    </>
  );
};

export default AuthForm;
