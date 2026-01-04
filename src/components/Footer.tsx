const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg text-foreground">Mental Tab</span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mental Tab
        </p>
      </div>
    </footer>
  );
};

export default Footer;
