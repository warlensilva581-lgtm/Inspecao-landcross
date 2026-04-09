import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'InspectionAppDB';
const STORE_IMAGES = 'diagramImages';
const STORE_PHOTOS = 'itemPhotos';
const STORE_CLONED_PARTS = 'clonedParts';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains(STORE_IMAGES)) {
          db.createObjectStore(STORE_IMAGES);
        }
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          db.createObjectStore(STORE_PHOTOS);
        }
        if (!db.objectStoreNames.contains(STORE_CLONED_PARTS)) {
          db.createObjectStore(STORE_CLONED_PARTS);
        }
      },
    });
  }
  return dbPromise;
};

export const storageService = {
  // Diagram Images
  async saveDiagramImage(key: string, base64: string): Promise<void> {
    const db = await getDB();
    await db.put(STORE_IMAGES, base64, key);
  },

  async getDiagramImage(key: string): Promise<string | undefined> {
    const db = await getDB();
    return db.get(STORE_IMAGES, key);
  },

  async getAllDiagramImages(): Promise<Record<string, string>> {
    const db = await getDB();
    const keys = await db.getAllKeys(STORE_IMAGES);
    const images: Record<string, string> = {};
    for (const key of keys) {
      images[key as string] = await db.get(STORE_IMAGES, key);
    }
    return images;
  },

  async deleteDiagramImage(key: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_IMAGES, key);
  },

  async clearDiagramImages(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_IMAGES);
  },

  // Item Photos (for selected items)
  async saveItemPhoto(id: string, base64: string): Promise<void> {
    const db = await getDB();
    await db.put(STORE_PHOTOS, base64, id);
  },

  async getItemPhoto(id: string): Promise<string | undefined> {
    const db = await getDB();
    return db.get(STORE_PHOTOS, id);
  },

  async deleteItemPhoto(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_PHOTOS, id);
  },

  async syncDiagramImages(currentImages: Record<string, string>): Promise<void> {
    const db = await getDB();
    const allKeys = await db.getAllKeys(STORE_IMAGES);
    const currentKeys = new Set(Object.keys(currentImages));
    
    for (const key of allKeys) {
      if (!currentKeys.has(key as string)) {
        await db.delete(STORE_IMAGES, key);
      }
    }
  },

  async syncItemPhotos(usedPhotoIds: Set<string>): Promise<void> {
    const db = await getDB();
    const allKeys = await db.getAllKeys(STORE_PHOTOS);
    
    for (const key of allKeys) {
      if (!usedPhotoIds.has(key as string)) {
        await db.delete(STORE_PHOTOS, key);
      }
    }
  },

  async clearItemPhotos(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_PHOTOS);
  },

  // Cloned Parts
  async saveClonedParts(data: any): Promise<void> {
    const db = await getDB();
    await db.put(STORE_CLONED_PARTS, data, 'main');
  },

  async getClonedParts(): Promise<any | undefined> {
    const db = await getDB();
    return db.get(STORE_CLONED_PARTS, 'main');
  },

  async clearClonedParts(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_CLONED_PARTS);
  },

  async clearAll(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_IMAGES);
    await db.clear(STORE_PHOTOS);
    await db.clear(STORE_CLONED_PARTS);
  },

  async getEstimatedSize(): Promise<number> {
    const db = await getDB();
    let total = 0;
    
    const stores = [STORE_IMAGES, STORE_PHOTOS, STORE_CLONED_PARTS];
    for (const storeName of stores) {
      const all = await db.getAll(storeName);
      all.forEach(item => {
        if (typeof item === 'string') {
          total += item.length;
        } else if (typeof item === 'object') {
          total += JSON.stringify(item).length;
        }
      });
    }
    return total;
  }
};
