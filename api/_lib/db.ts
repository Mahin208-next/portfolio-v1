import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let client: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

// Fallback file-based database for local development or when Supabase keys are not set yet
const LOCAL_DB_PATH = path.join(
  process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), '.data'),
  'portfolio_db.json'
);

interface LocalStore {
  admin_credentials?: { id: string; password_hash: string; updated_at?: string }[];
  portfolio_config?: Record<string, any>;
}

function readLocalStore(): LocalStore {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local store:', err);
  }
  return {};
}

function writeLocalStore(store: LocalStore) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local store:', err);
  }
}

/**
 * Universal database interface matching the Supabase query patterns used in the API
 */
export const supabase = {
  from(tableName: 'admin_credentials' | 'portfolio_config') {
    if (client) {
      return client.from(tableName);
    }

    // Fallback store implementation
    return {
      select(_columns = '*') {
        return {
          eq(field: string, val: string) {
            return {
              async single() {
                const store = readLocalStore();
                if (tableName === 'admin_credentials') {
                  const item = store.admin_credentials?.find((x) => (x as any)[field] === val);
                  return { data: item || null, error: item ? null : { message: 'Not found' } };
                }
                if (tableName === 'portfolio_config') {
                  const data = store.portfolio_config;
                  return { data: data || null, error: data ? null : { message: 'Not found' } };
                }
                return { data: null, error: { message: 'Unknown table' } };
              },
            };
          },
        };
      },
      async insert(record: any) {
        const store = readLocalStore();
        if (tableName === 'admin_credentials') {
          store.admin_credentials = store.admin_credentials || [];
          store.admin_credentials.push(record);
          writeLocalStore(store);
          return { data: record, error: null };
        }
        return { data: null, error: null };
      },
      update(updates: any) {
        return {
          async eq(field: string, val: string) {
            const store = readLocalStore();
            if (tableName === 'admin_credentials') {
              store.admin_credentials = store.admin_credentials || [];
              const idx = store.admin_credentials.findIndex((x) => (x as any)[field] === val);
              if (idx !== -1) {
                store.admin_credentials[idx] = { ...store.admin_credentials[idx], ...updates };
              } else {
                store.admin_credentials.push({ id: val, ...updates });
              }
              writeLocalStore(store);
              return { data: updates, error: null };
            }
            return { data: null, error: null };
          },
        };
      },
      async upsert(record: any) {
        const store = readLocalStore();
        if (tableName === 'portfolio_config') {
          store.portfolio_config = { ...store.portfolio_config, ...record };
          writeLocalStore(store);
          return { data: record, error: null };
        }
        return { data: null, error: null };
      },
    } as any;
  },
};
