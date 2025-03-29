import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { login, signup } from "~/api/user";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthContext from "~/context/AuthContext";
import { LucideTv } from "lucide-react";
import { Link } from "react-router";

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

  const { login: loginContext } = useContext(AuthContext);

  const handlelogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", loginData);

    try {
      const response = await login(loginData);
      console.log("Login response:", response);

      if (!response || response.error) {
        toast.error(response?.error || "Invalid credentials");
        return;
      }

      // Update the auth context with the user data
      loginContext(response.user);
      console.log("Context updated with user:", response.user);

      toast.success("Login successful!");
      navigate(`/user/${response.user.name}`);
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    }
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

  return (
    <>
      <title>Animadom | Get Started</title>

      <div className="flex min-h-screen w-full items-center justify-center p-4 ">
        {/* Logo in top left corner */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 z-10"
        >
          <LucideTv className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold font-mono text-white">
            <div className="sm:block hidden">アニマドム</div>
            <span className="sm:hidden">Animadom</span>
          </h1>
        </Link>

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
            <div className="flex w-full flex-col lg:flex-row">
              {/* Image Section */}
              <motion.div
                className="h-[800px] overflow-hidden w-full lg:w-1/2 hidden lg:block"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-zinc-900/90 mix-blend-multiply"></div>
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
                      <h1 className="mb-4 text-2xl lg:text-4xl font-bold text-white">
                        {formState === "signin"
                          ? "Welcome Back!"
                          : "Join Our Community"}
                      </h1>
                      <p className="text-sm lg:text-lg text-purple-200">
                        {formState === "signin"
                          ? "Sign in to access your account and continue your journey with us."
                          : "Create an account to get started and explore all our features."}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Form container */}
              <div className="flex w-full lg:w-1/2 items-center justify-center p-4 lg:p-8 bg-zinc-900 text-zinc-200">
                <div className="w-full max-w-md">
                  {/* Sign In Form */}
                  {formState === "signin" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full"
                    >
                      <h2 className="mb-2 text-3xl font-bold text-white">
                        Sign In
                      </h2>
                      <p className="mb-6 text-zinc-400">
                        Enter your credentials to access your account
                      </p>
                      <form className="space-y-4" onSubmit={handlelogin}>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-zinc-300"
                          >
                            Email
                          </label>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
                              placeholder="your.email@example.com"
                              value={loginData.email}
                              onChange={handlogindata}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-zinc-300"
                            >
                              Password
                            </label>
                            <a
                              href="#"
                              className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Forgot password?
                            </a>
                          </div>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
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
                            className="h-4 w-4 rounded border-zinc-700 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-zinc-400"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="pt-4">
                          <motion.button
                            type="submit"
                            className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Sign In
                          </motion.button>
                        </div>
                      </form>
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="bg-zinc-900 px-2 text-zinc-500">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <motion.button
                            className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Google
                          </motion.button>
                          <motion.button
                            className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Facebook
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-400">
                          Don't have an account?{" "}
                          <motion.button
                            onClick={() => handleSwitch("signup")}
                            className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Sign Up
                          </motion.button>
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
                      <h2 className="mb-2 text-3xl font-bold text-white">
                        Create Account
                      </h2>
                      <p className="mb-6 text-zinc-400">
                        Sign up to get started with your new account
                      </p>
                      <form className="space-y-4" onSubmit={handlesignup}>
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-zinc-300"
                          >
                            Full Name
                          </label>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
                              placeholder="John Doe"
                              value={signupData.name}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="signup-email"
                            className="block text-sm font-medium text-zinc-300"
                          >
                            Email
                          </label>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="email"
                              id="signup-email"
                              name="email"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
                              placeholder="your.email@example.com"
                              value={signupData.email}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="signup-password"
                            className="block text-sm font-medium text-zinc-300"
                          >
                            Password
                          </label>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="password"
                              id="signup-password"
                              name="password"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
                              placeholder="••••••••"
                              value={signupData.password}
                              onChange={handleSignupdata}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-zinc-300"
                          >
                            Confirm Password
                          </label>
                          <div className="mt-1 rounded-md border border-zinc-700 focus-within:border-violet-500 focus-within:ring focus-within:ring-violet-500/20 bg-zinc-800/50">
                            <input
                              type="password"
                              id="confirm-password"
                              name="confirmPassword"
                              className="block w-full border-0 px-4 py-3 bg-transparent text-zinc-200 focus:outline-none focus:ring-0"
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
                            className="h-4 w-4 rounded border-zinc-700 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                          />
                          <label
                            htmlFor="terms"
                            className="ml-2 block text-sm text-zinc-400"
                          >
                            I agree to the{" "}
                            <a
                              href="#"
                              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                        <div className="pt-4">
                          <motion.button
                            type="submit"
                            className="w-full rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Create Account
                          </motion.button>
                        </div>
                      </form>
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="bg-zinc-900 px-2 text-zinc-500">
                              Or sign up with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <motion.button
                            className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Google
                          </motion.button>
                          <motion.button
                            className="flex w-full items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Facebook
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-400">
                          Already have an account?{" "}
                          <motion.button
                            onClick={() => handleSwitch("signin")}
                            className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Sign In
                          </motion.button>
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
