import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20 border rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        
        {/* Logo Section */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Job-Portal</h3>
          <p className="text-sm">Call us</p>
          <p className="font-semibold text-white">123 456 7890</p>

          
        </div>

        {/* Candidates */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Candidates</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
            <li><Link to="/candidate/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li className="hover:text-white cursor-pointer">Job Alerts</li>
          </ul>
        </div>

        {/* Employers */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Employers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/employer/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/employer/jobs/new" className="hover:text-white">Submit Job</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">Terms</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy</li>
            <li className="hover:text-white cursor-pointer">Security</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-2 border-t border-gray-800 text-center px-6 py-6 text-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          &copy; {new Date().getFullYear()}  Job Portal. All rights reserved.
        {/* Social Icons */}
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <Facebook className="cursor-pointer hover:text-white" size={18} />
              <Twitter className="cursor-pointer hover:text-white" size={18} />
              <Linkedin className="cursor-pointer hover:text-white" size={18} />
              <Instagram className="cursor-pointer hover:text-white" size={18} />
            </div>
          </div>
          </div>
    </footer>
  );
};

export default Footer;
