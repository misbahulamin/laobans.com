import { useState, useCallback } from "react";
import * as api from "../api/shipmentApi";

export function useShipmentList(token, params = {}) {
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
        const result = await api.listShipments(token, { ...params, ...newParams });
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

export function useShipment(token, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getShipment(token, id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  const update = useCallback(
    async (updateData) => {
      const result = await api.updateShipment(token, id, updateData);
      setData(result);
      return result;
    },
    [token, id]
  );

  const remove = useCallback(async () => {
    await api.deleteShipment(token, id);
    setData(null);
  }, [token, id]);

  const updateStatus = useCallback(
    async (status) => {
      const result = await api.updateShipmentStatus(token, id, status);
      setData(result);
      return result;
    },
    [token, id]
  );

  return { data, loading, error, refetch: fetch, update, remove, updateStatus };
}

export function useShipmentTracking(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const track = useCallback(
    async (trackingNumber) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.trackShipment(token, trackingNumber);
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

  return { data, loading, error, track };
}
