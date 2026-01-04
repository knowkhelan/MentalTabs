const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-foreground">Mental Tabs</span>
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Beta</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © 2024 Mental Tabs. Clear your mind.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
