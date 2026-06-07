import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";

export default function Signin() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await login(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard/overview");
    } else {
      toast.error(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white">ShipSource</span>
          </div>
        </div>
        <div className="text-white">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Welcome to ShipSource
          </h2>
          <p className="text-lg opacity-90">
            Your complete shipping and sourcing management solution. Track shipments, manage suppliers, and optimize your procurement process.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-3xl font-bold">500+</p>
            <p className="text-sm opacity-75">Companies</p>
          </div>
          <div>
            <p className="text-3xl font-bold">12,500+</p>
            <p className="text-sm opacity-75">Shipments</p>
          </div>
          <div>
            <p className="text-3xl font-bold">120+</p>
            <p className="text-sm opacity-75">Countries</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-primary">ShipSource</span>
            </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl font-heading font-bold text-primary">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Contact sales
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
