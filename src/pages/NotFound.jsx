import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="text-8xl font-heading font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-heading font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <HiHome className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
