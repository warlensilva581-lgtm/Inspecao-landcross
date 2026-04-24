import { get, set, clear } from 'idb-keyval';

/**
 * Interface para garantir que o TypeScript entenda a estrutura das imagens
 */
interface ImageRecord {
  [key: string]: string | null;
}

export const storage = {
  // Salva as imagens do diagrama (base64) de forma otimizada
  saveImages: async (images: ImageRecord): Promise<void> => {
    const keys = Object.keys(images);
    await set('diagramImages_keys', keys);
    for (const key of keys) {
      const imageData = images[key];
      if (imageData) {
        await set(`diag_${key}`, imageData);
      }
    }
  },

  // Recupera as imagens do diagrama
  getImages: async (): Promise<ImageRecord> => {
    const keys = (await get<string[]>('diagramImages_keys')) || [];
    const images: ImageRecord = {};
    for (const key of keys) {
      const savedImage = await get<string>(`diag_${key}`);
      images[key] = savedImage || null;
    }
    return images;
  },

  // Salva as anotações do canvas/diagrama
  saveAnnotations: async (annotations: any): Promise<void> => {
    await set('diagramAnnotations', annotations);
  },

  // Recupera as anotações
  getAnnotations: async (): Promise<any> => {
    return (await get('diagramAnnotations')) || {};
  },

  // Salva os itens selecionados (Peças/Inspeções) separando o texto das fotos pesadas
  saveSelectedItems: async (items: any[]): Promise<void> => {
    const metadata = await Promise.all(items.map(async (item: any) => {
      const { photo, annotations, ...rest } = item;
      
      // Salva a foto principal do item no IndexedDB
      if (photo && photo.startsWith('data:')) {
        const photoId = `item_${item.part?.id || 'unknown'}_${item.timestamp || Date.now()}`;
        await set(`img_${photoId}`, photo);
        rest.photo = `ref:${photoId}`; // Deixa apenas uma referência no JSON
      } else {
        rest.photo = photo;
      }

      // Salva as fotos das anotações individuais
      if (annotations && annotations.length > 0) {
        rest.annotations = await Promise.all(annotations.map(async (ann: any) => {
          if (ann.photoUrl && ann.photoUrl.startsWith('data:')) {
            const annId = `ann_${ann.id}`;
            await set(`img_${annId}`, ann.photoUrl);
            return { ...ann, photoUrl: `ref:${annId}` };
          }
          return ann;
        }));
      } else {
        rest.annotations = annotations;
      }

      return rest;
    }));
    await set('selectedItems_meta', metadata);
  },

  // Reconstrói o objeto completo, trocando as referências pelas fotos reais (base64)
  getSelectedItems: async (): Promise<any[]> => {
    const metadata = (await get<any[]>('selectedItems_meta')) || [];
    return await Promise.all(metadata.map(async (item) => {
      // Restaura a foto do item
      if (item.photo && typeof item.photo === 'string' && item.photo.startsWith('ref:')) {
        const photoData = await get<string>(item.photo.replace('ref:', 'img_'));
        item.photo = photoData || null;
      }
      
      // Restaura as fotos das anotações
      if (item.annotations) {
        item.annotations = await Promise.all(item.annotations.map(async (ann: any) => {
          if (ann.photoUrl && typeof ann.photoUrl === 'string' && ann.photoUrl.startsWith('ref:')) {
            const annPhotoData = await get<string>(ann.photoUrl.replace('ref:', 'img_'));
            return { ...ann, photoUrl: annPhotoData || null };
          }
          return ann;
        }));
      }
      return item;
    }));
  },

  // Limpa todo o banco de dados local
  clearAll: async (): Promise<void> => {
    await clear();
  }
};
