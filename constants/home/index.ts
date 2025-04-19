import { ArrowRight, BarChart3, Calendar, Globe, Leaf, Users } from "lucide-react"


let features = [
  {
    title: "Website Carbon Calculator",
    description: "Calculate and understand the carbon footprint of your websites based on file size, server location, and more.",
    href: "/website-calculator",
    icon: Globe,
  },
  {
    title: "AI Carbon Calculator",
    description: "Estimate emissions from AI workloads like model training and inference with detailed breakdowns.",
    href: "/ai-calculator",
    icon: BarChart3,
  },
  {
    title: "Carbon Footprint Tracker",
    description: "Track your personal or organizational carbon footprint over time, with actionable insights and recommendations.",
    href: "/carbon-tracker",
    icon: Calendar,
  },
  {
    title: "Volunteer Hub",
    description: "Join our community of volunteers to help make a difference in sustainability efforts.",
    href: "/volunteer-hub",
    icon: Users,
  },
  {
    title: "Resources",
    description: "Access a curated list of resources, articles, and tools to help you on your sustainability journey.",
    href: "/resources",
    icon: Leaf,
  },

]

export {features}