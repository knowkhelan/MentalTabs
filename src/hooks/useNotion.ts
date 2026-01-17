import { useState, useCallback } from "react";
import {
  checkNotionConnection,
  syncToNotion,
  getNotionPages,
  getNotionDatabases,
  createNotionDatabase,
  type IngestData,
  type NotionPage,
  type NotionDatabase,
} from "@/services/notionService";
import { toast } from "@/hooks/use-toast";

interface UseNotionOptions {
  userEmail?: string;
  userId?: string;
}

export function useNotion(options: UseNotionOptions = {}) {
  const { userEmail, userId } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; configured: boolean } | null>(null);

  /**
   * Check if Notion is connected
   */
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await checkNotionConnection(userEmail, userId);
      setConnectionStatus(status);
      return status;
    } catch (error) {
      console.error("Error checking Notion connection:", error);
      setConnectionStatus({ connected: false, configured: false });
      return { connected: false, configured: false };
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, userId]);

  /**
   * Sync data to Notion
   */
  const syncData = useCallback(
    async (data: IngestData) => {
      setIsLoading(true);
      try {
        const result = await syncToNotion(data, userEmail, userId);
        toast({
          title: "Success",
          description: "Data synced to Notion successfully",
        });
        return result;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to sync data to Notion",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail, userId]
  );

  /**
   * Get Notion pages
   */
  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getNotionPages(userEmail, userId);
      return result.data?.results || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Notion pages",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, userId]);

  /**
   * Get Notion databases
   */
  const fetchDatabases = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getNotionDatabases(userEmail, userId);
      return result.data?.results || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Notion databases",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, userId]);

  /**
   * Create a new Notion database
   */
  const createDatabase = useCallback(
    async (pageId: string, title: string, description: string) => {
      setIsLoading(true);
      try {
        const result = await createNotionDatabase(
          pageId,
          title,
          description,
          userEmail,
          userId
        );
        toast({
          title: "Success",
          description: "Notion database created successfully",
        });
        return result.data;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create Notion database",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail, userId]
  );

  return {
    isLoading,
    isConnected: connectionStatus?.connected ?? null,
    isConfigured: connectionStatus?.configured ?? null,
    connectionStatus,
    checkConnection,
    syncData,
    fetchPages,
    fetchDatabases,
    createDatabase,
  };
}



