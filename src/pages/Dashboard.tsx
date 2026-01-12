import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
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

type ConnectionStatus = "active" | "needs_attention" | "disconnected";

interface Connection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: ConnectionStatus;
  lastSync: string | null;
}

// Mock data
const mockUser = {
  email: "user@example.com",
  initials: "U",
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
    connected: true,
    status: "active",
    lastSync: "2 mins ago",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: "📧",
    connected: true,
    status: "active",
    lastSync: "5 mins ago",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "📱",
    connected: true,
    status: "needs_attention",
    lastSync: "1 hour ago",
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
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: "📊",
    connected: false,
    status: "disconnected",
    lastSync: null,
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

  // Check OAuth status on mount and handle OAuth callback
  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    const oauthError = searchParams.get("error");

    if (oauthStatus === "success") {
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
    } else if (oauthError) {
      console.error("OAuth error:", oauthError);
      // Clean up URL
      navigate("/dashboard", { replace: true });
    }

    // Check connection status from backend
    const checkConnectionStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/status`);
        const data = await response.json();
        if (data.connected) {
          setInputSources((prev) =>
            prev.map((conn) =>
              conn.id === "gmail"
                ? { ...conn, connected: true, status: "active" as const, lastSync: "Connected" }
                : conn
            )
          );
        }
      } catch (error) {
        // Backend might not be running, ignore error
        console.log("Could not check connection status:", error);
      }
    };

    checkConnectionStatus();
  }, [searchParams, navigate]);

  const handleOpenConfig = (id: string) => {
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

  const handleConnect = (id: string, type: "input" | "data") => {
    // Special handling for Gmail OAuth flow
    if (id === "gmail" && type === "input") {
      // Redirect to backend OAuth endpoint with returnTo parameter
      const returnTo = window.location.pathname; // /dashboard
      window.location.href = `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
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

  const handleLogout = () => {
    navigate("/");
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
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {mockUser.initials}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">
                    {mockUser.email}
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