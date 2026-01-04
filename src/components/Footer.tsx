const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mental Inbox
        </p>
        <div className="flex items-center gap-6">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
