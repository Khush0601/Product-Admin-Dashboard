import type { Product, ProductInput } from '@/lib/products';

const KEY = 'productOverrides';

type ProductStore = {
  edited: Record<string, Partial<Product>>;
  deleted: Array<number | string>;
  created: Product[];
};

const emptyStore = (): ProductStore => ({ edited: {}, deleted: [], created: [] });

function readStore(): ProductStore {
  if (typeof window === 'undefined') return emptyStore();

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<ProductStore>;
    return { edited: parsed.edited || {}, deleted: parsed.deleted || [], created: parsed.created || [] };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ProductStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function recordEdit(id: number | string, updatedFields: Partial<ProductInput>) {
  const store = readStore();
  const key = String(id);
  store.edited[key] = { ...(store.edited[key] || {}), ...updatedFields };
  writeStore(store);
}

export function recordDelete(id: number | string) {
  const store = readStore();
  if (!store.deleted.some((deletedId) => String(deletedId) === String(id))) store.deleted.push(id);
  writeStore(store);
}

export function recordCreate(product: ProductInput): Product {
  const store = readStore();
  const created = { ...product, id: `new-${Date.now()}` };
  store.created.unshift(created);
  writeStore(store);
  return created;
}

export function applyOverrides(products: Product[]) {
  const store = readStore();
  return products
    .filter((product) => !store.deleted.some((id) => String(id) === String(product.id)))
    .map((product) => ({ ...product, ...(store.edited[String(product.id)] || {}) }));
}

export function getCreatedProducts() {
  return readStore().created;
}

export function getSingleWithOverrides(product: Product | null) {
  if (!product) return null;
  const store = readStore();
  if (store.deleted.some((id) => String(id) === String(product.id))) return null;
  return { ...product, ...(store.edited[String(product.id)] || {}) };
}

export function findCreatedById(id: string) {
  return getCreatedProducts().find((product) => String(product.id) === String(id)) || null;
}
