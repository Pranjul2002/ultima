"use client";

import { createContext, useContext, useMemo, useState } from "react";

const FileContext = createContext(null);

export function FileProvider({ children }) {
  const [files, setFiles] = useState([]);

  const addFile = (file) => {
    if (!file) return;

    setFiles((prev) => {
      const alreadyExists = prev.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, file];
    });
  };

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    setFiles((prev) => {
      const existingKeys = new Set(
        prev.map(
          (item) => `${item.name}-${item.size}-${item.lastModified}`
        )
      );

      const uniqueNewFiles = [];

      newFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (!existingKeys.has(key)) {
          existingKeys.add(key);
          uniqueNewFiles.push(file);
        }
      });

      return [...prev, ...uniqueNewFiles];
    });
  };

  const removeFile = (fileToRemove) => {
    setFiles((prev) =>
      prev.filter(
        (item) =>
          !(
            item.name === fileToRemove.name &&
            item.size === fileToRemove.size &&
            item.lastModified === fileToRemove.lastModified
          )
      )
    );
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const value = useMemo(
    () => ({
      files,
      addFile,
      addFiles,
      removeFile,
      clearFiles,
    }),
    [files]
  );

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);

  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }

  return context;
}