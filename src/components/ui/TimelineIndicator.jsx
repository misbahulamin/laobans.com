import { motion } from "framer-motion";
import { HiCheck, HiClock } from "react-icons/hi";
import { cn } from "../../lib/utils";

const statusOrder = ["pending", "processing", "shipped", "in_transit", "customs", "delivered"];

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In Transit",
  customs: "Customs",
  delivered: "Delivered",
};

export function TimelineIndicator({ stages = [], currentStage, className }) {
  const currentIndex = statusOrder.indexOf(currentStage);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {statusOrder.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const stageData = stages.find((s) => s.status === status);

        return (
          <div key={status} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted && "bg-success text-white",
                isCurrent && "bg-primary text-white ring-4 ring-primary/20",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <HiCheck className="w-5 h-5" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium text-center",
                isCurrent && "text-primary",
                !isCurrent && "text-muted-foreground"
              )}
            >
              {statusLabels[status]}
            </span>
            {stageData?.date && (
              <span className="text-[10px] text-muted-foreground mt-1">
                {new Date(stageData.date).toLocaleDateString()}
              </span>
            )}
            {index < statusOrder.length - 1 && (
              <div
                className={cn(
                  "absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 -z-10",
                  index < currentIndex ? "bg-success" : "bg-muted"
                )}
                style={{ width: "calc(100% - 40px)", left: "50px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
