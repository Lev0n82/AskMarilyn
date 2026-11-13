import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Gavel } from "lucide-react";

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  correctAnswer?: string;
  onDismiss: () => void;
}

export function FeedbackOverlay({ isVisible, isCorrect, correctAnswer, onDismiss }: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative p-8 rounded-xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full text-center overflow-hidden ${
              isCorrect 
                ? "bg-green-950 border-green-500 text-green-100" 
                : "bg-red-950 border-red-500 text-red-100"
            }`}
          >
            {/* Smash Effect Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('/images/cracked-glass.png')] bg-cover bg-center pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              {isCorrect ? (
                <>
                  <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircle className="w-24 h-24 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                  </motion.div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter transform -rotate-2 text-green-400 drop-shadow-lg border-4 border-green-400 p-2 rounded-lg inline-block">
                    APPROVED!
                  </h2>
                  <p className="text-lg font-bold">The logic is sound!</p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <XCircle className="w-24 h-24 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  </motion.div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter transform rotate-2 text-red-500 drop-shadow-lg border-4 border-red-500 p-2 rounded-lg inline-block">
                    DENIED!
                  </h2>
                  <div className="space-y-2">
                    <p className="font-bold text-xl">Incorrect Logic Detected.</p>
                    {correctAnswer && (
                      <p className="text-sm opacity-90 bg-black/30 p-2 rounded">
                        Correct Answer: <span className="font-mono font-bold">{correctAnswer}</span>
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-red-800/50">
                      <p className="text-sm italic opacity-80">Think you were right?</p>
                      <a 
                        href="#" 
                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold underline decoration-2 underline-offset-2"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Gavel className="w-4 h-4" />
                        Visit IThinkIHaveACase.com
                      </a>
                    </div>
                  </div>
                </>
              )}
              
              <p className="text-xs mt-6 opacity-50 uppercase tracking-widest">Click anywhere to continue</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
