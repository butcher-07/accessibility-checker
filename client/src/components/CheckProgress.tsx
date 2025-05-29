import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface CheckProgressProps {
  currentUrl?: string;
  totalProcessed: number;
  currentBatch: number;
  completedUrls: string[];
  status: 'analyzing' | 'completed' | 'batch_start';
}

export default function CheckProgress({ 
  currentUrl, 
  totalProcessed,
  currentBatch,
  completedUrls,
  status
}: CheckProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-6"
    >
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Accessibility Analysis Progress</h3>
          <span className="text-sm text-muted-foreground">
            Batch {currentBatch + 1} • {totalProcessed} URLs processed
          </span>
        </div>
        
        {currentUrl && status === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 bg-primary/10 rounded-md"
          >
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <div className="flex-1">
              <span className="text-sm font-medium">Currently analyzing:</span>
              <div className="text-sm text-muted-foreground break-all">{currentUrl}</div>
            </div>
          </motion.div>
        )}
        
        {completedUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recently completed:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {completedUrls.slice(-5).map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground break-all">{url}</span>
                </motion.div>
              ))}
              {completedUrls.length > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  ... and {completedUrls.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}