import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CheckProgressProps {
  currentUrl?: string;
  totalProcessed: number;
  completedUrls: string[];
  remainingUrls: number;
}

export default function CheckProgress({
  currentUrl,
  totalProcessed,
  completedUrls,
  remainingUrls
}: CheckProgressProps) {
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  // Get unique URLs
  const uniqueUrls = Array.from(new Set(completedUrls));

  // Determine what to display
  const displayedUrls = showAllCompleted ? uniqueUrls : uniqueUrls.slice(-5);
  const hasMore = uniqueUrls.length > 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Analysis Progress</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{totalProcessed}</span> processed
              </span>
            </div>
            {remainingUrls > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{remainingUrls}</span> remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {currentUrl && remainingUrls > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-md mb-4"
          >
            <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Currently analyzing
              </span>
              <div className="text-sm text-foreground break-all font-medium">
                {currentUrl}
              </div>
            </div>
          </motion.div>
        )}

        {uniqueUrls.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                {showAllCompleted
                  ? `All completed (${uniqueUrls.length})`
                  : 'Recently completed'}
              </h4>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setShowAllCompleted(!showAllCompleted)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors font-medium"
                >
                  {showAllCompleted ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Show all
                    </>
                  )}
                </button>
              )}
            </div>

            <div className={`space-y-1.5 ${showAllCompleted ? 'max-h-64 overflow-y-auto pr-2' : ''}`}>
              <AnimatePresence mode="popLayout">
                {displayedUrls.map((url, index) => (
                  <motion.div
                    key={`${url}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5 text-sm py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground break-all flex-1 text-sm">
                      {url}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
