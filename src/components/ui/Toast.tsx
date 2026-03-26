'use client';

import { useToastStore, ToastType } from '@/stores/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from './Button';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-xs px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; message: string; type: ToastType };
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const isSuccess = toast.type === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border-2 backdrop-blur-md',
        isSuccess 
          ? 'bg-sage-50/90 border-sage-200 text-sage-800' 
          : 'bg-blush-50/90 border-blush-200 text-blush-800'
      )}
    >
      <div className={cn(
        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isSuccess ? 'bg-sage-500 text-white' : 'bg-blush-500 text-white'
      )}>
        {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      </div>
      
      <p className="flex-1 text-sm font-bold leading-tight">
        {toast.message}
      </p>

      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
