'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import { TopHeader } from '@/frontend/components/TopHeader';
import { MetricCards } from '@/frontend/components/MetricCards';
import { FilterBar } from '@/frontend/components/FilterBar';
import { PermitTable, PermitListItem } from '@/frontend/components/PermitTable';
import { 
  PlusCircle, 
  Layers, 
  Activity, 
  ClockAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70">
      {/* Top Context Header */}
      <TopHeader onRefresh={fetchPermits} refreshing={refreshing} />

      {/* Main Container */}
      <main className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Page Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Permit to Work (PTW) Register
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-2xs">
                Live EHS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              High-hazard maintenance authorization, safety controls verification, and immutable compliance logging.
            </p>
          </div>

          <Link
            href="/permits/new"
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Issue Safety Permit</span>
          </Link>
        </div>

        {/* Executive KPI Metric Cards (4 Banners) */}
        <MetricCards
          total={globalStats.total}
          active={globalStats.active}
          pending={globalStats.pending}
          expiringSoon={globalStats.expiringSoon}
          currentFilter={currentMetricFilter}
          onFilterClick={(cardId) => handleMetricCardClick(cardId)}
        />

        {/* Filter Bar with Custom SaaS Popover Menus */}
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
    </div>
  );
}
