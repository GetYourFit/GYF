import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Lightbulb, Sun, Sparkles } from "lucide-react"; // icons

const InsightsModal = ({ isOpen, onClose }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const fetchInsights = async () => {
        try {
          setLoading(true);
          setError(null);

          const res = await fetch("http://localhost:3000/api/insights", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          });
          if (!res.ok) throw new Error("Failed to fetch insights");

          const data = await res.json();
          setInsights(data.insights); // store only insights object
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInsights();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">✨ Fashion Insights</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Loading/Error */}
        {loading && <p className="text-gray-500 animate-pulse">Loading insights...</p>}
        {error && <p className="text-red-500">⚠️ {error}</p>}

        {/* Insights Content */}
        {insights && (
          <div className="space-y-6">
            {/* Practical Tips */}
            {insights.practicalTips?.length > 0 && (
              <motion.div
                className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow-sm"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Practical Tips
                  </h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {insights.practicalTips.map((tip, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Seasonal Recommendations */}
            {insights.seasonalRecommendations?.length > 0 && (
              <motion.div
                className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Seasonal Recommendations
                  </h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {insights.seasonalRecommendations.map((rec, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Why GYF */}
            {insights.whyGYF?.length > 0 && (
              <motion.div
                className="p-4 rounded-xl bg-purple-50 border border-purple-200 shadow-sm"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Why GYF?</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {insights.whyGYF.map((reason, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {reason}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsModal;
