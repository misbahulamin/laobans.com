import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiLockClosed } from "react-icons/hi";
import { Button } from "../components/ui/button";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <HiLockClosed className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard/overview">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
