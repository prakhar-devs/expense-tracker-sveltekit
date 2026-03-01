import { get, set } from 'idb-keyval';
import { supabase } from '$lib/supabaseClient';
import type { Transaction } from '$lib/constants';

const OFFLINE_QUEUE_KEY = 'spendwise_offline_queue';

export type OfflineMutationType = 'add_transaction' | 'delete_transaction';

export interface QueuedMutation {
    id: string; // Temporary UUID for tracking
    type: OfflineMutationType;
    payload: any;
    timestamp: number;
}

/**
 * Pushes a mutation to the IndexedDB queue when offline.
 */
export async function queueOfflineMutation(type: OfflineMutationType, payload: any): Promise<string> {
    const queue = await get<QueuedMutation[]>(OFFLINE_QUEUE_KEY) || [];
    const id = crypto.randomUUID();
    queue.push({ id, type, payload, timestamp: Date.now() });
    await set(OFFLINE_QUEUE_KEY, queue);
    return id;
}

/**
 * Processes all queued mutations and syncs them with Supabase.
 */
export async function processOfflineQueue() {
    if (typeof window === 'undefined' || !navigator.onLine) return;

    const queue = await get<QueuedMutation[]>(OFFLINE_QUEUE_KEY) || [];
    if (queue.length === 0) return;

    const remaining: QueuedMutation[] = [];

    for (const item of queue) {
        try {
            if (item.type === 'add_transaction') {
                const { error } = await supabase.from('transactions').insert(item.payload);
                if (error) throw error;
            } else if (item.type === 'delete_transaction') {
                const { error } = await supabase.from('transactions').delete().eq('id', item.payload);
                if (error) throw error;
            }
            // Add other mutation handlers as needed (update, etc.)
        } catch (err) {
            console.error('Sync Engine: Failed to process mutation', item, err);
            // Re-queue the item if it failed (e.g., server error)
            remaining.push(item);
        }
    }

    // Save any remaining (failed) mutations back to the queue
    await set(OFFLINE_QUEUE_KEY, remaining);

    // Optionally trigger a global event here to tell the UI to refetch
    window.dispatchEvent(new CustomEvent('spendwise-sync-complete'));
}

// Automatically process queue when connection is restored
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        processOfflineQueue();
    });
}
