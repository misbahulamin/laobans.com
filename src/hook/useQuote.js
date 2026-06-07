import { useState, useCallback } from "react";
import * as api from "../api/quoteApi";

export function useQuoteList(token, params = {}) {
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
        const result = await api.listQuotes(token, { ...params, ...newParams });
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

export function useQuote(token, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getQuote(token, id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  const update = useCallback(
    async (updateData) => {
      const result = await api.updateQuote(token, id, updateData);
      setData(result);
      return result;
    },
    [token, id]
  );

  const approve = useCallback(async () => {
    const result = await api.approveQuote(token, id);
    setData(result);
    return result;
  }, [token, id]);

  const reject = useCallback(async (reason) => {
    const result = await api.rejectQuote(token, id, reason);
    setData(result);
    return result;
  }, [token, id]);

  const remove = useCallback(async () => {
    await api.deleteQuote(token, id);
    setData(null);
  }, [token, id]);

  return { data, loading, error, refetch: fetch, update, approve, reject, remove };
}

export function useQuoteComparison(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compare = useCallback(
    async (quoteIds) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.compareQuotes(token, quoteIds);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { data, loading, error, compare };
}
