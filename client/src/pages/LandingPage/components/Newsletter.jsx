import React from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="px-4 py-12 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto bg-[#dfeee4] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        {/* Left Text */}
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Let employers find you
          </h3>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Advertise your jobs to millions of monthly users and search 15.8
            million CVs in our database.
          </p>
        </div>

        {/* Right Input */}
        <div className="w-full md:w-auto flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
          <input
            type="email"
            placeholder="Your e-mail"
            className="px-4 py-3 w-full md:w-64 outline-none text-sm"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-medium transition md:w-50">
            Subscribe
          </button>
        </div>
      </motion.div>
    </section>
  );
}