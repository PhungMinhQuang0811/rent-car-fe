// open IndexedDB
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fileDB", 1);
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files"); // create object store if it doesn't exist
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
};

// save file to IndexedDB
export const saveFileToDB = async (key: string, file: any): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.put(file, key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // report change
        resolve(true);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error saving file to DB:", error);
    return false;
  }
};

// get file from IndexedDB
export const getFileFromDB = async (key: string): Promise<any> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("files", "readonly");
      const store = transaction.objectStore("files");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null); // return null if not found
      request.onerror = () => reject(null);
    });
  } catch (error) {
    console.error("Error getting file from DB:", error);
    return null;
  }
};

// delete file from IndexedDB
export const deleteFileFromDB = async (key: string): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.delete(key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // report change
        resolve(true);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error deleting file from DB:", error);
    return false;
  }
};

// delete all files from IndexedDB
export const clearAllFilesFromDB = async (): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("All files deleted from IndexedDB.");
        resolve(true);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error clearing files from IndexedDB:", error);
    return false;
  }
};

// get all keys from IndexedDB
export const getAllKeysFromDB = async (): Promise<IDBValidKey[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.getAllKeys();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting keys from IndexedDB:", error);
    return [];
  }
};
