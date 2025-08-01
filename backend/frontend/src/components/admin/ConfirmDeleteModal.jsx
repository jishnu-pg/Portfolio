import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2 } from 'lucide-react';

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmText = 'Delete',
  icon = <Trash2 className="w-8 h-8 text-red-500 animate-pulse" />,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-t-4 border-red-500 p-8 max-w-sm w-full relative"
        >
          <div className="flex items-center mb-5">
            <div className="flex-shrink-0 mr-3">
              {icon}
            </div>
            <div>
              <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-1">{title}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">{description}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold shadow-sm transition-all duration-200"
            >
              Cancel
            </button>
            <motion.button
              onClick={onConfirm}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmDeleteModal; 