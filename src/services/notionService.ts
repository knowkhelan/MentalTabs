import { API_BASE_URL } from "@/lib/config";

export interface IngestData {
  title?: string;
  source?: string;
  content?: string;
  created_at?: string;
}

export interface NotionPage {
  id: string;
  object: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, any>;
}

export interface NotionDatabase {
  id: string;
  object: string;
  title: Array<{ plain_text: string }>;
  properties: Record<string, any>;
}

export interface NotionApiResponse<T> {
  status: "ok" | "error";
  message: string;
  data?: T;
}

/**
 * Check if Notion is connected for a user
 */
export async function checkNotionConnection(
  userEmail?: string,
  userId?: string
): Promise<boolean> {
  try {
    // Note: Backend doesn't have a dedicated status endpoint for Notion
    // We'll try to fetch databases as a way to check connection
    const params = new URLSearchParams();
    if (userEmail) params.append("user_email", userEmail);
    if (userId) params.append("user_id", userId);

    const response = await fetch(
      `${API_BASE_URL}/get-notion-databases?${params.toString()}`
    );

    if (response.ok) {
      const data: NotionApiResponse<any> = await response.json();
      return data.status === "ok";
    }
    return false;
  } catch (error) {
    console.error("Error checking Notion connection:", error);
    return false;
  }
}

/**
 * Sync data to Notion database
 */
export async function syncToNotion(
  data: IngestData,
  userEmail?: string,
  userId?: string
): Promise<NotionApiResponse<any>> {
  try {
    const params = new URLSearchParams();
    if (userEmail) params.append("user_email", userEmail);
    if (userId) params.append("user_id", userId);

    const response = await fetch(
      `${API_BASE_URL}/ingest?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result: NotionApiResponse<any> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to sync to Notion");
    }

    return result;
  } catch (error) {
    console.error("Error syncing to Notion:", error);
    throw error;
  }
}

/**
 * Get all Notion pages for a user
 */
export async function getNotionPages(
  userEmail?: string,
  userId?: string
): Promise<NotionApiResponse<{ results: NotionPage[] }>> {
  try {
    const params = new URLSearchParams();
    if (userEmail) params.append("user_email", userEmail);
    if (userId) params.append("user_id", userId);

    const response = await fetch(
      `${API_BASE_URL}/get-notion-pages?${params.toString()}`
    );

    const result: NotionApiResponse<{ results: NotionPage[] }> =
      await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch Notion pages");
    }

    return result;
  } catch (error) {
    console.error("Error fetching Notion pages:", error);
    throw error;
  }
}

/**
 * Get all Notion databases for a user
 */
export async function getNotionDatabases(
  userEmail?: string,
  userId?: string
): Promise<NotionApiResponse<{ results: NotionDatabase[] }>> {
  try {
    const params = new URLSearchParams();
    if (userEmail) params.append("user_email", userEmail);
    if (userId) params.append("user_id", userId);

    const response = await fetch(
      `${API_BASE_URL}/get-notion-databases?${params.toString()}`
    );

    const result: NotionApiResponse<{ results: NotionDatabase[] }> =
      await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch Notion databases");
    }

    return result;
  } catch (error) {
    console.error("Error fetching Notion databases:", error);
    throw error;
  }
}

/**
 * Create a new Notion database
 */
export async function createNotionDatabase(
  pageId: string,
  title: string,
  description: string,
  userEmail?: string,
  userId?: string
): Promise<NotionApiResponse<NotionDatabase>> {
  try {
    const params = new URLSearchParams();
    if (userEmail) params.append("user_email", userEmail);
    if (userId) params.append("user_id", userId);

    const response = await fetch(
      `${API_BASE_URL}/create-notion-database?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_id: pageId,
          title,
          description,
        }),
      }
    );

    const result: NotionApiResponse<NotionDatabase> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create Notion database");
    }

    return result;
  } catch (error) {
    console.error("Error creating Notion database:", error);
    throw error;
  }
}

