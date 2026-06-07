import { motion } from "framer-motion";

export function DataLoader({ text = "Loading...", fullScreen = true }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">{text}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full border-t-primary animate-spin" />
      </div>
    </div>
  );
}
