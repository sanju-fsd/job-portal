import { Search, FileText, MessageCircle, Users, BarChart3, ShieldCheck } from "lucide-react";

export const features = {
  seekers: [
    {
      icon: Search,
      title: "Smart Job Matching",
      desc: "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences.",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      desc: "Create professional resumes with our intuitive builder and templates designed by experts.",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      desc: "Connect directly with hiring managers and recruiters through our secure messaging platform.",
    },
  ],
  employers: [
    {
      icon: Users,
      title: "Talent Pool Access",
      desc: "Access our vast database of pre-screened candidates and find the perfect fit for your team.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Track your hiring performance with detailed analytics and insights on candidate engagement.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Candidates",
      desc: "All candidates undergo background verification to ensure you're hiring trustworthy professionals.",
    },
  ],
};