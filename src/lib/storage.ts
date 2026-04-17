import { get, set, del, keys, clear } from 'idb-keyval';

const IMAGE_STORE_KEY = 'diagram_images_db';

export const storage = {
  async saveImages(images: Record<string, string | null>) {
    await set(IMAGE_STORE_KEY, images);
  },

  async getImages(): Promise<Record<string, string | null>> {
    const images = await get(IMAGE_STORE_KEY);
    return images || {};
  },

  async clearAll() {
    await clear();
  }
};
