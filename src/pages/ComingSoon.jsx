import { motion } from "framer-motion";
import { HiCog } from "react-icons/hi";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function ComingSoon({ title = "Coming Soon" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <HiCog className="w-12 h-12 text-muted-foreground animate-spin" style={{ animationDuration: "3s" }} />
      </motion.div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        This feature is currently under development. Stay tuned for updates!
      </p>
      <Link to="/dashboard/overview">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
