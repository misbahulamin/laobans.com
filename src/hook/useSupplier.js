import { useState, useCallback } from "react";
import * as api from "../api/supplierApi";

export function useSupplierList(token, params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  });

  const fetch = useCallback(
    async (newParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.listSuppliers(token, { ...params, ...newParams });
        setData(result.results || result);
        setPagination({
          count: result.count || 0,
          next: result.next,
          previous: result.previous,
          page: newParams.page || 1,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token, JSON.stringify(params)]
  );

  const refetch = useCallback(() => fetch(), [fetch]);

  return { data, loading, error, pagination, refetch, fetch };
}

export function useSupplier(token, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSupplier(token, id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  const update = useCallback(
    async (updateData) => {
      const result = await api.updateSupplier(token, id, updateData);
      setData(result);
      return result;
    },
    [token, id]
  );

  const remove = useCallback(async () => {
    await api.deleteSupplier(token, id);
    setData(null);
  }, [token, id]);

  return { data, loading, error, refetch: fetch, update, remove };
}

export function useSupplierPerformance(token, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSupplierPerformance(token, id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  return { data, loading, error, refetch: fetch };
}
