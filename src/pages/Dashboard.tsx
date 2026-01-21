import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { setToken, apiGet, apiPost, removeToken } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Calendar,
  TrendingUp,
  Link2,
  Plus,
  Settings,
  LogOut,
  Edit,
  X,
  RefreshCw,
} from "lucide-react";
import ColumnsConfigDialog from "@/components/dashboard/ColumnsConfigDialog";
import NotionSetupDialog from "@/components/dashboard/NotionSetupDialog";
import logo from "@/assets/logo.png";

type ConnectionStatus = "active" | "needs_attention" | "disconnected";

interface Connection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: ConnectionStatus;
  lastSync: string | null;
  comingSoon?: boolean;
  configured?: boolean; // For Notion: true if database_id is set
}

// Helper function to get initials from email or name
const getInitials = (email?: string, name?: string): string => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
};

const mockStats = {
  totalMessages: 1247,
  messagesToday: 23,
  messagesThisWeek: 156,
  activeConnections: 3,
};

const mockInputSources: Connection[] = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "📧",
    connected: false,
    status: "disconnected",
    lastSync: null,
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💬",
    connected: false,
    status: "disconnected",
    lastSync: null,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "📱",
    connected: false,
    status: "disconnected",
    lastSync: null,
    comingSoon: true,
  },
];

const mockDataSources: Connection[] = [
  {
    id: "notion",
    name: "Notion",
    icon: "📝",
    connected: false,
    status: "disconnected",
    lastSync: null,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: "📊",
    connected: false,
    status: "disconnected",
    lastSync: null,
    comingSoon: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "needs_attention":
      return "bg-yellow-500";
    case "disconnected":
      return "bg-red-500";
    default:
      return "bg-muted";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "needs_attention":
      return "Needs Attention";
    case "disconnected":
      return "Disconnected";
    default:
      return "Unknown";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputSources, setInputSources] = useState(mockInputSources);
  const [dataSources, setDataSources] = useState(mockDataSources);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [configDialogSource, setConfigDialogSource] = useState<string | null>(null);
  const [notionSetupOpen, setNotionSetupOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [columnConfigs, setColumnConfigs] = useState<Record<string, string[]>>({
    notion: ["title", "status", "date-created"],
    "google-sheets": ["title", "status", "date-created"],
  });
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name?: string;
    picture?: string;
    initials: string;
  }>({
    email: "",
    initials: "U",
  });

  // Check if onboarding is complete, redirect if not
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      // If user is not logged in, redirect to auth
      if (isLoggedIn !== "true") {
        navigate("/auth", { replace: true });
        return;
      }

      // Check backend for onboarding status
      try {
        const authStatus = await apiGet("/auth/status");
        // If user is logged in but hasn't completed onboarding, redirect to onboarding
        if (!authStatus.onboarding_complete) {
          navigate("/onboarding", { replace: true });
          return;
        }
      } catch (error) {
        // If API call fails (e.g., no token), redirect to auth
        console.log("Could not check onboarding status:", error);
        navigate("/auth", { replace: true });
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  // Check OAuth status on mount and handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const oauthStatus = searchParams.get("oauth");
      const notionStatus = searchParams.get("notion");
      const oauthError = searchParams.get("error");

      if (oauthStatus === "success") {
        // Store user info from OAuth redirect
        const emailFromParams = searchParams.get("email");
        const nameFromParams = searchParams.get("name");
        const pictureFromParams = searchParams.get("picture");
        const tokenFromParams = searchParams.get("token");
        
        // Store JWT token if provided
        if (tokenFromParams) {
          setToken(tokenFromParams);
        }
        
        if (emailFromParams) {
          localStorage.setItem("userEmail", emailFromParams);
          localStorage.setItem("isLoggedIn", "true"); // Set logged in flag
          if (nameFromParams) {
            localStorage.setItem("userName", nameFromParams);
          }
          if (pictureFromParams) {
            localStorage.setItem("userPicture", pictureFromParams);
          }
          
          // Update user info state
          setUserInfo({
            email: emailFromParams,
            name: nameFromParams || undefined,
            picture: pictureFromParams || undefined,
            initials: getInitials(emailFromParams, nameFromParams || undefined),
          });
        }
        
        // Update Gmail connection status
        setInputSources((prev) =>
          prev.map((conn) =>
            conn.id === "gmail"
              ? { ...conn, connected: true, status: "active" as const, lastSync: "Just now" }
              : conn
          )
        );
        
        // Check backend for onboarding status and redirect accordingly
        try {
          const authStatus = await apiGet("/auth/status");
          if (!authStatus.onboarding_complete) {
            navigate("/onboarding", { replace: true });
          } else {
            // Clean up URL but stay on dashboard
            navigate("/dashboard", { replace: true });
          }
        } catch (error) {
          // If API call fails, assume onboarding not complete
          console.log("Could not check onboarding status:", error);
          navigate("/onboarding", { replace: true });
        }
    } else if (notionStatus === "connected" || notionStatus === "setup_needed") {
      // Notion OAuth successful - check configuration status
      const checkNotionStatus = async () => {
        try {
          const storedEmail = localStorage.getItem("userEmail");
          if (storedEmail) {
            setUserEmail(storedEmail);
            const notionData = await apiGet("/notion/status");
            
            if (notionData.connected) {
              setDataSources((prev) =>
                prev.map((conn) =>
                  conn.id === "notion"
                    ? { 
                        ...conn, 
                        connected: true, 
                        configured: notionData.configured || false,
                        status: notionData.configured ? ("active" as const) : ("needs_attention" as const),
                        lastSync: notionData.configured ? "Configured" : "Needs setup"
                      }
                    : conn
                )
              );
              
              // If setup is needed, open FTUX modal
              if (notionStatus === "setup_needed" || !notionData.configured) {
                setNotionSetupOpen(true);
              }
            }
          }
        } catch (error) {
          console.log("Could not check Notion status:", error);
        }
      };
        checkNotionStatus();
        // Clean up URL
        navigate("/dashboard", { replace: true });
      } else if (oauthError) {
        console.error("OAuth error:", oauthError);
        // Clean up URL
        navigate("/dashboard", { replace: true });
      }
    };

    handleOAuthCallback();

    // Load user info from localStorage on mount
    const loadUserInfo = () => {
      const storedEmail = localStorage.getItem("userEmail");
      const storedName = localStorage.getItem("userName");
      const storedPicture = localStorage.getItem("userPicture");
      
      if (storedEmail) {
        // Ensure logged in flag is set if user email exists
        localStorage.setItem("isLoggedIn", "true");
        setUserEmail(storedEmail);
        setUserInfo({
          email: storedEmail,
          name: storedName || undefined,
          picture: storedPicture || undefined,
          initials: getInitials(storedEmail, storedName || undefined),
        });
      }
    };

    // Check connection status from backend and update user info
    const checkConnectionStatus = async () => {
      try {
        // Check auth status using JWT
        const data = await apiGet("/auth/status");
        
        if (data.connected) {
          setInputSources((prev) =>
            prev.map((conn) =>
              conn.id === "gmail"
                ? { ...conn, connected: true, status: "active" as const, lastSync: "Connected" }
                : conn
            )
          );
        }
        
        // Update user info from backend response
        if (data.email_address) {
          if (!localStorage.getItem("userEmail")) {
            localStorage.setItem("userEmail", data.email_address);
          }
          setUserInfo({
            email: data.email_address,
            name: data.name || undefined,
            picture: data.picture || undefined,
            initials: getInitials(data.email_address, data.name || undefined),
          });
        }

        // Check Notion status
        const notionData = await apiGet("/notion/status");
        
        if (notionData.connected) {
          setDataSources((prev) =>
            prev.map((conn) =>
              conn.id === "notion"
                ? { 
                    ...conn, 
                    connected: true, 
                    configured: notionData.configured || false,
                    status: notionData.configured ? ("active" as const) : ("needs_attention" as const),
                    lastSync: notionData.configured ? "Configured" : "Needs setup"
                  }
                : conn
            )
          );
        }
      } catch (error) {
        // Backend might not be running or token expired, ignore error
        console.log("Could not check connection status:", error);
      }
    };

    loadUserInfo();
    checkConnectionStatus();
  }, [searchParams, navigate]);

  const handleOpenConfig = (id: string) => {
    // Special handling for Notion - open FTUX modal instead
    if (id === "notion") {
      setNotionSetupOpen(true);
      return;
    }
    
    // Other integrations use the old config dialog
    setConfigDialogSource(id);
    setConfigDialogOpen(true);
  };

  const handleSaveColumns = (columns: string[]) => {
    if (configDialogSource) {
      setColumnConfigs((prev) => ({
        ...prev,
        [configDialogSource]: columns,
      }));
    }
  };

  const getSourceName = (id: string | null) => {
    return dataSources.find((s) => s.id === id)?.name || "";
  };

  const handleNotionSetupComplete = async () => {
    // Refresh Notion connection status after setup
    try {
      const notionData = await apiGet("/notion/status");
      
      if (notionData.connected) {
        setDataSources((prev) =>
          prev.map((conn) =>
            conn.id === "notion"
              ? { 
                  ...conn, 
                  connected: true, 
                  configured: notionData.configured || false,
                  status: notionData.configured ? ("active" as const) : ("needs_attention" as const),
                  lastSync: notionData.configured ? "Configured" : "Needs setup"
                }
              : conn
          )
        );
      }
    } catch (error) {
      console.log("Could not refresh Notion status:", error);
    }
  };

  const handleConnect = (id: string, type: "input" | "data") => {
    // Special handling for Gmail OAuth flow
    if (id === "gmail" && type === "input") {
      // Redirect to backend OAuth endpoint with returnTo parameter
      const returnTo = window.location.pathname; // /dashboard
      const storedEmail = localStorage.getItem("userEmail");
      const url = storedEmail
        ? `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}&user_email=${encodeURIComponent(storedEmail)}`
        : `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
      window.location.href = url;
      return;
    }

    const setter = type === "input" ? setInputSources : setDataSources;
    setter((prev) =>
      prev.map((conn) =>
        conn.id === id
          ? { ...conn, connected: true, status: "active" as const, lastSync: "Just now" }
          : conn
      )
    );
  };

  const handleRemove = (id: string, type: "input" | "data") => {
    const setter = type === "input" ? setInputSources : setDataSources;
    setter((prev) =>
      prev.map((conn) =>
        conn.id === id
          ? { ...conn, connected: false, status: "disconnected" as const, lastSync: null }
          : conn
      )
    );
  };

  const handleReconnect = (id: string, type: "input" | "data") => {
    const setter = type === "input" ? setInputSources : setDataSources;
    setter((prev) =>
      prev.map((conn) =>
        conn.id === id
          ? { ...conn, status: "active" as const, lastSync: "Just now" }
          : conn
      )
    );
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint to revoke Gmail account access
      await apiPost("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Clear user info and token from localStorage
      removeToken();
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPicture");
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Mental Tabs" className="w-12 h-12 object-contain" />
              <h1 className="font-display text-xl font-bold text-foreground">
                Mental<span className="text-primary">Tabs</span>
              </h1>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                  {userInfo.picture ? (
                    <img
                      src={userInfo.picture}
                      alt={userInfo.email}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {userInfo.initials}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  {userInfo.name && (
                    <p className="text-sm font-medium text-foreground">
                      {userInfo.name}
                    </p>
                  )}
                  <p className={`text-sm ${userInfo.name ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                    {userInfo.email || "Not logged in"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Upload Section */}
        <section className="mb-10">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Upload Image or Paste Text
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Extract text from images using OCR and sync to Notion
                  </p>
                </div>
                <Button onClick={() => navigate("/upload")} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Sources Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Connections
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Connection
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inputSources.map((connection) => (
              <Card key={connection.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{connection.icon}</span>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {connection.name}
                        </h3>
                        {connection.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {connection.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Health badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        connection.status === "active"
                          ? "bg-green-100 text-green-700"
                          : connection.status === "needs_attention"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getStatusLabel(connection.status)}
                    </span>
                  </div>

                  {connection.connected ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      {connection.status === "needs_attention" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReconnect(connection.id, "input")}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(connection.id, "input")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : connection.comingSoon ? (
                    <div className="flex items-center justify-center py-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        Coming soon
                      </span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleConnect(connection.id, "input")}
                    >
                      Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Data Sources
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((connection) => (
              <Card key={connection.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{connection.icon}</span>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {connection.name}
                        </h3>
                        {connection.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {connection.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Health badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        connection.status === "active"
                          ? "bg-green-100 text-green-700"
                          : connection.status === "needs_attention"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getStatusLabel(connection.status)}
                    </span>
                  </div>

                  {connection.connected ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenConfig(connection.id)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      {connection.status === "needs_attention" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReconnect(connection.id, "data")}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(connection.id, "data")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : connection.comingSoon ? (
                    <div className="flex items-center justify-center py-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        Coming soon
                      </span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleConnect(connection.id, "data")}
                    >
                      {connection.id === "notion" ? "Connect" : "Connect"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Columns Config Dialog */}
        <ColumnsConfigDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          destinationName={getSourceName(configDialogSource)}
          selectedColumns={configDialogSource ? columnConfigs[configDialogSource] || [] : []}
          onSave={handleSaveColumns}
        />

        {/* Notion Setup Dialog (FTUX) */}
        <NotionSetupDialog
          open={notionSetupOpen}
          onOpenChange={setNotionSetupOpen}
          userEmail={userEmail}
          onComplete={handleNotionSetupComplete}
        />

        {/* Stats Section */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Total Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-foreground">
                  {mockStats.totalMessages.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Messages Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-foreground">
                  {mockStats.messagesToday}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-foreground">
                  {mockStats.messagesThisWeek}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Active Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-foreground">
                  {mockStats.activeConnections}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;