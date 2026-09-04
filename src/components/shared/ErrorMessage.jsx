import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// ✅ مكون رسالة الخطأ المشترك (يُستخدم في نماذج التواصل)
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
};

export default ErrorMessage;
