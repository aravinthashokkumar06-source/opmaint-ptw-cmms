'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  plannedEnd?: string | Date | null;
  status: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ plannedEnd, status }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isUnderTwoHours: boolean;
    isUnderThirtyMins: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isUnderTwoHours: false,
    isUnderThirtyMins: false,
  });

  useEffect(() => {
    if (!plannedEnd) return;

    function calculate() {
      if (!plannedEnd) return;
      const target = new Date(plannedEnd).getTime();
      if (isNaN(target)) return;

      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isUnderTwoHours: false,
          isUnderThirtyMins: false,
        });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const totalMinutes = diff / (1000 * 60);

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
        isUnderTwoHours: totalMinutes <= 120,
        isUnderThirtyMins: totalMinutes <= 30,
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [plannedEnd]);

  if (!plannedEnd) {
    return <span className="text-xs text-slate-400 font-mono">--</span>;
  }

  const dateObj = new Date(plannedEnd);
  if (isNaN(dateObj.getTime())) {
    return <span className="text-xs text-slate-400 font-mono">--</span>;
  }

  if (status !== 'ACTIVE') {
    return (
      <span className="text-xs text-slate-600 font-medium font-mono">
        {dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">
        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
        EXPIRED
      </span>
    );
  }

  if (timeLeft.isUnderThirtyMins) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-300 shadow-sm animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    );
  }

  if (timeLeft.isUnderTwoHours) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <Clock className="w-3.5 h-3.5 text-emerald-600" />
      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
};
