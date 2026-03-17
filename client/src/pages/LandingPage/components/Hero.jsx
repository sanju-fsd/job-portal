import { motion } from "framer-motion";
import { Search, ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthenticated = !!user;

  const stats = [
    { icon: Users, label: "Active Users", value: "2.4M+" },
    { icon: Building2, label: "Companies", value: "12K+" },
    { icon: TrendingUp, label: "New Jobs", value: "2.4M+" },
  ];

  return (
    <div>
      <section className="pt-24 pb-16 bg-blue-50 min-h-screen flex items-center">
        <div className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="motion-h1"
            >
              Find Your Job or
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2 ">
                Perfect Hire
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="motion-p "
            >
              Connect talent with opportunity in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="motion-div "
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="motion-btn "
                onClick={() => navigate("/jobs")}
              >
                <Search className="w-5 h-5" />
                <span>Find Jobs</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform " />
              </motion.button>

              <motion.button
                className="motion-btn_1 "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(
                    isAuthenticated && user.role === "employer"
                      ? "/employer/jobs/new"
                      : "/login"
                  );
                }}
              >
                Post a Job here
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="motion-div_1"
            >
              {stats.map((stat, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className="motion-div_2"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-2 ">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-40 h-32 bg-blue-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-0.5 left-0.5 transform -translate-x-0.5 -translate-y-0.5 w-96 h-96 bg-grandient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30" />
        </div>
      </section>
    </div>
  );
}

export default Hero;
