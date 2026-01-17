import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { useNotion } from "@/hooks/useNotion";
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
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ColumnsConfigDialog from "@/components/dashboard/ColumnsConfigDialog";
import NotionSetupDialog from "@/components/dashboard/NotionSetupDialog";

type ConnectionStatus = "active" | "needs_attention" | "disconnected";

interface Connection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  configured?: boolean; // For Notion: whether database is configured
  status: ConnectionStatus;
  lastSync: string | null;
  comingSoon?: boolean; // Whether this service is coming soon
}

interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
}

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
    comingSoon: false,
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💬",
    connected: false,
    status: "disconnected",
    lastSync: null,
    comingSoon: true,
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: "📧",
    connected: false,
    status: "disconnected",
    lastSync: null,
    comingSoon: true,
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
    connected: true,
    status: "active",
    lastSync: "5 mins ago",
    comingSoon: false,
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
  const [columnConfigs, setColumnConfigs] = useState<Record<string, string[]>>({
    notion: ["title", "status", "date-created"],
    "google-sheets": ["title", "status", "date-created"],
  });
  const [notionSetupOpen, setNotionSetupOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Debug flag: Set to true to always show FTUX for testing
  const FORCE_SHOW_NOTION_FTUX = false;

  // Initialize Notion hook
  // Note: In production, you'd get userEmail/userId from auth context
  const { checkConnection: checkNotionConnection } = useNotion({
    // userEmail: "user@example.com", // TODO: Get from auth context
    // userId: "user-id", // TODO: Get from auth context
  });

  // Get user email from localStorage and fetch profile
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const picture = localStorage.getItem("userPicture");
    
    if (email) {
      setUserEmail(email);
      
      // Set profile from localStorage if available
      if (name || picture) {
        setUserProfile({
          email,
          name: name || undefined,
          picture: picture || undefined,
        });
      }
      
      // Fetch user profile from backend
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/status?user_email=${encodeURIComponent(email)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.email_address) {
              const profile: UserProfile = {
                email: data.email_address,
                name: data.name || undefined,
                picture: data.picture || undefined,
              };
              setUserProfile(profile);
              
              // Store in localStorage
              if (profile.name) localStorage.setItem("userName", profile.name);
              if (profile.picture) localStorage.setItem("userPicture", profile.picture);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      
      fetchUserProfile();
    }
    
    // Debug: Force show FTUX if flag is enabled
    if (FORCE_SHOW_NOTION_FTUX && email) {
      setTimeout(() => {
        setNotionSetupOpen(true);
        setDataSources((prev) =>
          prev.map((conn) =>
            conn.id === "notion"
              ? { ...conn, connected: true, status: "needs_attention" as const, lastSync: "Setup required" }
              : conn
          )
        );
      }, 500);
    }
  }, [FORCE_SHOW_NOTION_FTUX]);

  // Check OAuth status on mount and handle OAuth callback
  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    const notionStatus = searchParams.get("notion");
    const oauthError = searchParams.get("error");

    if (oauthStatus === "success") {
      // Get user info from URL params
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      const picture = searchParams.get("picture");
      
      if (email) {
        setUserEmail(email);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAuthenticated", "true");
        
        if (name) {
          localStorage.setItem("userName", name);
        }
        if (picture) {
          localStorage.setItem("userPicture", picture);
        }
        
        // Update profile state
        setUserProfile({
          email,
          name: name || undefined,
          picture: picture || undefined,
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
      // Clean up URL
      navigate("/dashboard", { replace: true });
    } else if (notionStatus === "setup_needed") {
      console.log("Notion connected - setup needed!");
      // Update Notion connection status to show as connected but needs configuration
      setDataSources((prev) =>
        prev.map((conn) =>
          conn.id === "notion"
            ? { ...conn, connected: true, configured: false, status: "needs_attention" as const, lastSync: "Setup required" }
            : conn
        )
      );
      
      // Show the setup dialog
      setNotionSetupOpen(true);
      
      // Clean up URL
      navigate("/dashboard", { replace: true });
    } else if (notionStatus === "connected") {
      // Update Notion connection status - check if configured
      const checkConfig = async () => {
        try {
          const status = await checkNotionConnection();
          const isConfigured = status?.configured ?? false;
          setDataSources((prev) =>
            prev.map((conn) =>
              conn.id === "notion"
                ? { 
                    ...conn, 
                    connected: true, 
                    configured: isConfigured,
                    status: isConfigured ? ("active" as const) : ("needs_attention" as const),
                    lastSync: isConfigured ? "Just now" : "Setup required"
                  }
                : conn
            )
          );
        } catch (error) {
          // Default to configured if check fails
          setDataSources((prev) =>
            prev.map((conn) =>
              conn.id === "notion"
                ? { ...conn, connected: true, configured: true, status: "active" as const, lastSync: "Just now" }
                : conn
            )
          );
        }
      };
      checkConfig();
      // Clean up URL
      navigate("/dashboard", { replace: true });
    } else if (oauthError) {
      console.error("OAuth error:", oauthError);
      // Clean up URL
      navigate("/dashboard", { replace: true });
    }

    // Check connection status from backend
    const checkConnectionStatus = async () => {
      try {
        // Check Gmail connection status
        const gmailResponse = await fetch(`${API_BASE_URL}/auth/status`);
        const gmailData = await gmailResponse.json();
        if (gmailData.connected) {
          setInputSources((prev) =>
            prev.map((conn) =>
              conn.id === "gmail"
                ? { ...conn, connected: true, status: "active" as const, lastSync: "Connected" }
                : conn
            )
          );
        }

        // Check Notion connection and configuration status
        try {
          const notionStatus = await checkNotionConnection();
          if (notionStatus?.connected) {
            const isConfigured = notionStatus?.configured ?? false;
            setDataSources((prev) =>
              prev.map((conn) =>
                conn.id === "notion"
                  ? { 
                      ...conn, 
                      connected: true, 
                      configured: isConfigured,
                      status: isConfigured ? ("active" as const) : ("needs_attention" as const),
                      lastSync: isConfigured ? "Configured" : "Setup required"
                    }
                  : conn
              )
            );
          }
        } catch (error) {
          // Notion check failed, ignore
          console.log("Could not check Notion connection:", error);
        }
      } catch (error) {
        // Backend might not be running, ignore error
        console.log("Could not check connection status:", error);
      }
    };

    checkConnectionStatus();
  }, [searchParams, navigate]);

  const handleOpenConfig = (id: string) => {
    // Special handling for Notion - open FTUX modal instead
    if (id === "notion") {
      setNotionSetupOpen(true);
      return;
    }
    
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

  const handleNotionSetupComplete = () => {
    // Update Notion connection status to active and configured
    setDataSources((prev) =>
      prev.map((conn) =>
        conn.id === "notion"
          ? { ...conn, connected: true, configured: true, status: "active" as const, lastSync: "Just now" }
          : conn
      )
    );
  };

  const getSourceName = (id: string | null) => {
    return dataSources.find((s) => s.id === id)?.name || "";
  };

  const handleConnect = (id: string, type: "input" | "data") => {
    // Special handling for Gmail OAuth flow
    if (id === "gmail" && type === "input") {
      // Redirect to backend OAuth endpoint with returnTo parameter
      const returnTo = window.location.pathname; // /dashboard
      window.location.href = `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
      return;
    }

    // Special handling for Notion OAuth flow
    if (id === "notion" && type === "data") {
      // Get user email from localStorage (set after Google SSO)
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        console.error("User email not found in localStorage. Please login with Google first.");
        // Optionally redirect to auth page or show error
        return;
      }
      // Redirect to backend Notion OAuth endpoint with user email
      window.location.href = `${API_BASE_URL}/connect/notion?user_email=${encodeURIComponent(userEmail)}`;
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
      // Call backend logout endpoint
      if (userEmail) {
        await fetch(`${API_BASE_URL}/auth/logout?user_email=${encodeURIComponent(userEmail)}`, {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear all localStorage data
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPicture");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authMethod");
      
      // Reset state
      setUserEmail(null);
      setUserProfile(null);
      
      // Navigate to home
      navigate("/");
    }
  };
  
  const getUserInitials = (profile: UserProfile | null): string => {
    if (!profile) return "U";
    if (profile.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.name.substring(0, 2).toUpperCase();
    }
    return profile.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1 className="font-display text-xl font-bold text-foreground">
              Mental<span className="text-primary">Tabs</span>
            </h1>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                  {userProfile?.picture ? (
                    <img
                      src={userProfile.picture}
                      alt={userProfile.name || userProfile.email}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {getUserInitials(userProfile)}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  {userProfile?.name && (
                    <p className="text-sm font-medium text-foreground">
                      {userProfile.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.email || userEmail || "User"}
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
              <Card 
                key={connection.id} 
                className={`border-border ${connection.comingSoon ? "opacity-60" : ""}`}
              >
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
                    <div className="flex flex-col items-end gap-1">
                      {connection.comingSoon ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Clock className="w-3 h-3" />
                          Coming Soon
                        </span>
                      ) : (
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
                      )}
                    </div>
                  </div>

                  {connection.comingSoon ? (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled
                      variant="outline"
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      Coming Soon
                    </Button>
                  ) : connection.connected ? (
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
              <Card 
                key={connection.id} 
                className={`border-border ${connection.comingSoon ? "opacity-60" : ""}`}
              >
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
                    <div className="flex flex-col items-end gap-1">
                      {connection.comingSoon ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Clock className="w-3 h-3" />
                          Coming Soon
                        </span>
                      ) : (
                        <>
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
                          {/* Notion specific: Show "Connected" badge when configured */}
                          {connection.id === "notion" && connection.connected && connection.configured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Connected
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {connection.comingSoon ? (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled
                      variant="outline"
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      Coming Soon
                    </Button>
                  ) : connection.connected ? (
                    <>
                      {/* Notion: Show configuration hint if not configured */}
                      {connection.id === "notion" && !connection.configured && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-yellow-800">
                            <ArrowRight className="w-4 h-4 text-yellow-600 animate-pulse" />
                            <span className="flex-1">Complete setup to start syncing</span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleOpenConfig(connection.id)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          {connection.id === "notion" && !connection.configured ? "Setup" : "Configure"}
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
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleConnect(connection.id, "data")}
                    >
                      Connect
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

        {/* Notion Setup Dialog */}
        <NotionSetupDialog
          open={notionSetupOpen}
          onOpenChange={setNotionSetupOpen}
          userEmail={userEmail || undefined}
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