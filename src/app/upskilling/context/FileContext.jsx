"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const FileContext = createContext(null);

// Uses env var so it works on both localhost and Vercel
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const STATUS_POLL_INTERVAL = 2500;

function createLocalId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `src_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (["uploading", "uploaded"].includes(normalized)) return "uploading";
  if (["processing", "pending", "queued", "indexing", "parsing"].includes(normalized)) {
    return "processing";
  }
  if (["ready", "completed", "success", "done"].includes(normalized)) return "ready";
  if (["failed", "error"].includes(normalized)) return "failed";
  return "processing";
}

function createSourceFromFile(file) {
  return {
    localId: createLocalId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    status: "uploading",
    progress: 0,
    summary: "",
    error: "",
    backendId: "",
    uploadedAt: new Date().toISOString(),
    messages: [],
    citations: [],
  };
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function FileProvider({ children }) {
  const [sources, setSources] = useState([]);
  const [activeSourceId, setActiveSourceId] = useState(null);
  const pollersRef = useRef({});

  const updateSource = useCallback((localId, patch) => {
    setSources((prev) =>
      prev.map((source) =>
        source.localId === localId
          ? { ...source, ...(typeof patch === "function" ? patch(source) : patch) }
          : source
      )
    );
  }, []);

  const stopPolling = useCallback((localId) => {
    const existing = pollersRef.current[localId];
    if (existing) {
      window.clearInterval(existing);
      delete pollersRef.current[localId];
    }
  }, []);

  const pollSourceStatus = useCallback(
    (localId, backendId) => {
      if (!backendId || typeof window === "undefined") return;
      stopPolling(localId);

      const run = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/sources/${backendId}/status`,
            { method: "GET" }
          );
          const data = await safeJson(response);
          if (!response.ok) throw new Error(data?.message || "Unable to fetch source status.");

          const status = normalizeStatus(data?.status);
          updateSource(localId, {
            backendId,
            status,
            progress:
              typeof data?.progress === "number"
                ? Math.max(0, Math.min(100, data.progress))
                : status === "ready"
                ? 100
                : undefined,
            summary: data?.summary || "",
            error: "",
          });

          if (status === "ready" || status === "failed") stopPolling(localId);
        } catch (error) {
          updateSource(localId, {
            status: "failed",
            error: error instanceof Error ? error.message : "Unable to process this source.",
          });
          stopPolling(localId);
        }
      };

      run();
      pollersRef.current[localId] = window.setInterval(run, STATUS_POLL_INTERVAL);
    },
    [stopPolling, updateSource]
  );

  const uploadSource = useCallback(
    async (localId, file) => {
      const formData = new FormData();
      formData.append("file", file);
      updateSource(localId, { status: "uploading", progress: 5, error: "" });

      try {
        const response = await fetch(`${API_BASE_URL}/api/sources/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await safeJson(response);
        if (!response.ok) throw new Error(data?.message || "Upload failed.");

        const backendId = data?.sourceId || data?.documentId || data?.id;
        if (!backendId) throw new Error("Upload succeeded but no source id was returned.");

        const status = normalizeStatus(data?.status);
        updateSource(localId, {
          backendId,
          status,
          progress: status === "ready" ? 100 : 25,
          summary: data?.summary || "",
          error: "",
        });

        if (status !== "ready") pollSourceStatus(localId, backendId);
      } catch (error) {
        updateSource(localId, {
          status: "failed",
          error: error instanceof Error ? error.message : "Upload failed.",
        });
      }
    },
    [pollSourceStatus, updateSource]
  );

  const appendMessage = useCallback((sourceId, message) => {
    setSources((prev) =>
      prev.map((source) =>
        source.localId === sourceId
          ? { ...source, messages: [...source.messages, message] }
          : source
      )
    );
  }, []);

  const replaceMessage = useCallback((sourceId, messageId, patch) => {
    setSources((prev) =>
      prev.map((source) => {
        if (source.localId !== sourceId) return source;
        return {
          ...source,
          messages: source.messages.map((message) =>
            message.id === messageId
              ? { ...message, ...(typeof patch === "function" ? patch(message) : patch) }
              : message
          ),
        };
      })
    );
  }, []);

  const addFiles = useCallback(
    (incomingFiles) => {
      const fileList = Array.from(incomingFiles || []);
      if (fileList.length === 0) return;

      const freshSources = [];
      setSources((prev) => {
        const existingKeys = new Set(
          prev.map((item) => `${item.name}-${item.size}-${item.file?.lastModified}`)
        );
        const next = [...prev];
        fileList.forEach((file) => {
          const key = `${file.name}-${file.size}-${file.lastModified}`;
          if (existingKeys.has(key)) return;
          existingKeys.add(key);
          const source = createSourceFromFile(file);
          next.push(source);
          freshSources.push(source);
        });
        return next;
      });

      if (freshSources.length > 0) {
        setActiveSourceId((current) => current || freshSources[0].localId);
        freshSources.forEach((source) => uploadSource(source.localId, source.file));
      }
    },
    [uploadSource]
  );

  const addFile = useCallback(
    (file) => { if (file) addFiles([file]); },
    [addFiles]
  );

  const removeFile = useCallback(
    (localId) => {
      stopPolling(localId);
      setSources((prev) => prev.filter((source) => source.localId !== localId));
      setActiveSourceId((current) => {
        if (current !== localId) return current;
        const next = sources.find((source) => source.localId !== localId);
        return next?.localId || null;
      });
    },
    [sources, stopPolling]
  );

  const clearFiles = useCallback(() => {
    Object.keys(pollersRef.current).forEach((localId) => stopPolling(localId));
    setSources([]);
    setActiveSourceId(null);
  }, [stopPolling]);

  const askQuestion = useCallback(
    async (sourceId, question) => {
      const source = sources.find((item) => item.localId === sourceId);
      if (!source) throw new Error("No active source selected.");
      if (source.status !== "ready") throw new Error("This source is still being processed.");
      if (!source.backendId) throw new Error("This source is missing a backend id.");

      const userMessageId = createLocalId();
      const assistantMessageId = createLocalId();

      appendMessage(sourceId, {
        id: userMessageId,
        role: "user",
        content: question,
        citations: [],
        createdAt: new Date().toISOString(),
      });

      appendMessage(sourceId, {
        id: assistantMessageId,
        role: "assistant",
        content: "Thinking...",
        citations: [],
        createdAt: new Date().toISOString(),
        pending: true,
      });

      // Build history from all SETTLED messages (exclude the pending "Thinking..." one)
      // This is what gets sent to the backend so Groq has the full conversation context
      const history = source.messages
        .filter((m) => !m.pending && m.content && m.content !== "Thinking...")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: source.backendId,
            question,
            strictContext: true,
            history,   // ← send full conversation history to backend
          }),
        });

        const data = await safeJson(response);
        if (!response.ok) throw new Error(data?.message || "Unable to get response from AI.");

        replaceMessage(sourceId, assistantMessageId, {
          content:
            data?.answer ||
            "I could not find enough information in this source to answer that.",
          citations: Array.isArray(data?.citations) ? data.citations : [],
          pending: false,
        });
      } catch (error) {
        replaceMessage(sourceId, assistantMessageId, {
          content:
            error instanceof Error ? error.message : "Unable to get response from AI.",
          citations: [],
          pending: false,
          isError: true,
        });
      }
    },
    [appendMessage, replaceMessage, sources]
  );

  useEffect(() => {
    return () => {
      Object.values(pollersRef.current).forEach((id) => window.clearInterval(id));
    };
  }, []);

  const activeSource = useMemo(
    () => sources.find((source) => source.localId === activeSourceId) || null,
    [activeSourceId, sources]
  );

  const value = useMemo(
    () => ({
      files: sources,
      sources,
      activeSource,
      activeSourceId,
      addFile,
      addFiles,
      askQuestion,
      appendMessage,
      clearFiles,
      removeFile,
      setActiveSourceId,
      updateSource,
    }),
    [activeSource, activeSourceId, addFile, addFiles, askQuestion,
     appendMessage, clearFiles, removeFile, sources, updateSource]
  );

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFiles must be used within a FileProvider");
  return context;
}
