import React from "react";
import { motion } from "framer-motion";
import { features } from "../../utils/data";

export default function Features() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4">

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-16">

          <Column
            title="For Job Seekers"
            color="blue"
            data={features.seekers}
          />

          <Column
            title="For Employers"
            color="purple"
            data={features.employers}
          />

        </div>
      </div>
    </section>
  );
}



/* Column */

function Column({ title, data, color }) {
  const underline =
    color === "blue" ? "bg-blue-500" : "bg-purple-500";

  return (
    <div>
      {/* Title */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className={`w-12 h-[2px] mt-2 ${underline}`} />
      </div>

      {/* Items */}
      <div className="space-y-5">
        {data.map((item, i) => (
          <FeatureCard key={i} item={item} color={color} />
        ))}
      </div>
    </div>
  );
}



/* Card */

function FeatureCard({ item, color }) {
  const Icon = item.icon;

  const iconBg =
    color === "blue"
      ? "bg-blue-100 text-blue-600"
      : "bg-purple-100 text-purple-600";

  const hoverBg =
    color === "blue"
      ? "hover:bg-blue-50 hover:ring-1 hover:ring-blue-200"
      : "hover:bg-purple-50 hover:ring-1 hover:ring-purple-200";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-4 p-5 rounded-xl bg-white ${hoverBg} transition-all`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className="w-12 h-8" />
      </div>

      {/* Text */}
      <div>
        <h4 className="font-semibold text-gray-900">{item.title}</h4>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}