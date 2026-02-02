"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { BaseRecord, QueryOptions } from '@/db/storage/storage.types';
import { getCollection, createRecord, updateRecord, deleteRecord, clearCache } from './apiClient';

interface UseCollectionResult<T> {
  items: T[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useCollection<T extends BaseRecord>(
  collection: string,
  query?: QueryOptions
): UseCollectionResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const queryString = JSON.stringify(query || {});

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryObj: Record<string, string> = {};
      if (query?.search) queryObj.search = query.search;
      if (query?.status) queryObj.status = query.status;
      if (query?.clientId) queryObj.clientId = query.clientId;
      if (query?.limit) queryObj.limit = String(query.limit);
      if (query?.offset) queryObj.offset = String(query.offset);
      if (query?.sortBy) queryObj.sortBy = query.sortBy;
      if (query?.sortOrder) queryObj.sortOrder = query.sortOrder;
      
      const data = await getCollection<T>(collection, queryObj);
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [collection, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (data: Partial<T>): Promise<T | null> => {
    try {
      const item = await createRecord<T>(collection, data);
      await fetchData();
      return item;
    } catch {
      return null;
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<T | null> => {
    try {
      const item = await updateRecord<T>(collection, id, data);
      await fetchData();
      return item;
    } catch {
      return null;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      await deleteRecord(collection, id);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  };

  return { items, total, loading, error, refetch: fetchData, create, update, remove };
}

export function useRecord<T extends BaseRecord>(collection: string, id: string | null) {
  const [record, setRecord] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!id) {
      setRecord(null);
      return;
    }
    
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    fetch(`/api/collections/${collection}/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setRecord(data))
      .catch(e => setError(e.message))
      .finally(() => {
        setLoading(false);
        fetchingRef.current = false;
      });
  }, [collection, id]);

  return { record, loading, error };
}

export function useAuditEvents(recordId: string | null) {
  const [events, setEvents] = useState<Array<{id: string; ts: string; actorName: string; action: string; summary: string}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recordId) {
      setEvents([]);
      return;
    }
    
    setLoading(true);
    fetch(`/api/audit/${recordId}`)
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, [recordId]);

  return { events, loading };
}
