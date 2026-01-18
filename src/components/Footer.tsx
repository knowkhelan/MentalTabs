import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MentalTabs Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-display font-bold text-lg text-foreground">Mental Tabs</span>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Beta</span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Mental Tabs. Clear your mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
