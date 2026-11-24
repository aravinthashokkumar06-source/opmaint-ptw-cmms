'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import { MetricCards } from '@/frontend/components/MetricCards';
import { FilterBar } from '@/frontend/components/FilterBar';
import { PermitTable, PermitListItem } from '@/frontend/components/PermitTable';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  // Permits state
  const [permits, setPermits] = useState<PermitListItem[]>([]);
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [areaId, setAreaId] = useState('');
  const [myApprovalsOnly, setMyApprovalsOnly] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState(false);

  // Metadata
  const [areas, setAreas] = useState<{ id: string; name: string; plant: { name: string } }[]>([]);

  // Fetch metadata once
  useEffect(() => {
    async function loadMetadata() {
      try {
        const res = await fetch('/api/metadata');
        const data = await res.json();
        if (data.areas) {
          setAreas(data.areas);
        }
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    }
    loadMetadata();
  }, []);

  // Fetch permits
  const fetchPermits = useCallback(async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      if (areaId) params.append('areaId', areaId);
      if (expiringSoon) params.append('expiringSoon', 'true');
      if (myApprovalsOnly) params.append('myApprovalsPending', 'true');

      const headers: Record<string, string> = {};
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      const res = await fetch(`/api/permits?${params.toString()}`, { headers });
      const data = await res.json();
      if (data.permits) {
        setPermits(data.permits);
      }
      if (data.stats) {
        setGlobalStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch permits', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, status, type, areaId, expiringSoon, myApprovalsOnly, currentUser]);

  useEffect(() => {
    fetchPermits();
  }, [fetchPermits]);

  // Which banner card is currently active
  const currentMetricFilter = expiringSoon
    ? 'EXPIRING'
    : status === 'ACTIVE'
    ? 'ACTIVE'
    : status === 'PENDING_APPROVAL'
    ? 'PENDING_APPROVAL'
    : (!status && !expiringSoon && !myApprovalsOnly)
    ? 'ALL'
    : '';

  const handleMetricCardClick = (cardId: string) => {
    if (cardId === 'ALL') {
      setStatus('');
      setExpiringSoon(false);
      setMyApprovalsOnly(false);
    } else if (cardId === 'ACTIVE') {
      setStatus(prev => (prev === 'ACTIVE' ? '' : 'ACTIVE'));
      setExpiringSoon(false);
    } else if (cardId === 'PENDING_APPROVAL') {
      setStatus(prev => (prev === 'PENDING_APPROVAL' ? '' : 'PENDING_APPROVAL'));
      setExpiringSoon(false);
    } else if (cardId === 'EXPIRING') {
      setExpiringSoon(prev => !prev);
      setStatus('');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setType('');
    setAreaId('');
    setMyApprovalsOnly(false);
    setExpiringSoon(false);
  };

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Safety Permit to Work (PTW)
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Live Register
            </span>
          </div>
          <p className="text-sm text-slate-500 font-normal">
            Real-time industrial permit dashboard, safety verification and compliance tracking
          </p>
        </div>

        <button
          onClick={fetchPermits}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-slate-400 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : 'text-slate-500'}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Register'}</span>
        </button>
      </div>

      {/* KPI Cards (4 Banners) */}
      <MetricCards
        total={globalStats.total}
        active={globalStats.active}
        pending={globalStats.pending}
        expiringSoon={globalStats.expiringSoon}
        currentFilter={currentMetricFilter}
        onFilterClick={(cardId) => handleMetricCardClick(cardId)}
      />

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
        areaId={areaId}
        onAreaChange={setAreaId}
        areas={areas}
        myApprovalsOnly={myApprovalsOnly}
        onMyApprovalsToggle={() => setMyApprovalsOnly(!myApprovalsOnly)}
        expiringSoon={expiringSoon}
        onExpiringSoonToggle={() => setExpiringSoon(!expiringSoon)}
        onReset={handleResetFilters}
        activeCount={permits.length}
      />

      {/* Permits Table */}
      <PermitTable permits={permits} loading={loading} />
    </main>
  );
}
