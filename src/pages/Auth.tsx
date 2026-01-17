import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle OAuth callback
  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    const userEmail = searchParams.get("email");
    const oauthError = searchParams.get("error");

    if (oauthStatus === "success" && userEmail) {
      // Store email in localStorage
      localStorage.setItem("userEmail", userEmail);
      
      // Store name and picture if available
      const name = searchParams.get("name");
      const picture = searchParams.get("picture");
      if (name) {
        localStorage.setItem("userName", name);
      }
      if (picture) {
        localStorage.setItem("userPicture", picture);
      }
      
      // Set session indicator
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authMethod", "google");
      
      // Clean up URL and redirect to dashboard
      navigate("/dashboard", { replace: true });
    } else if (oauthError) {
      setError(`OAuth error: ${oauthError}`);
      // Clean up URL
      navigate("/auth", { replace: true });
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Include state parameter to redirect back to /auth after OAuth
    const state = encodeURIComponent("/auth");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=288826718697-k8bt2efbmpp9t618bu9clkv9o4mhuicn.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('https://api.mentaltabs.co/auth/google/callback')}&response_type=code&scope=${encodeURIComponent('openid email profile https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent&state=${state}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Mental<span className="text-primary">Tabs</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Error message */}
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {/* Google button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Redirecting..."
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;