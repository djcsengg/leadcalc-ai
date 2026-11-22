"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Download,
  Search,
  Filter,
  Calendar,
  Mail,
  User,
  Phone,
  FileSpreadsheet,
} from "lucide-react";

interface Lead {
  id: string;
  calculatorTitle: string;
  calculatorId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  inputs: Record<string, any>;
  result: Record<string, any>;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCalcId, setSelectedCalcId] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCalcId) params.set("calculatorId", selectedCalcId);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedCalcId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleExportCsv = () => {
    const url = `/api/leads?format=csv${selectedCalcId ? `&calculatorId=${selectedCalcId}` : ""}`;
    window.location.href = url;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Captured Leads CRM
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            High-intent contacts captured before or after calculator interactions.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center space-x-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name or email..."
            className="w-full rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-xs font-medium placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        <button
          type="button"
          onClick={fetchLeads}
          className="rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Filter
        </button>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Captured Leads ({leads.length})</h2>
          <span className="text-xs text-slate-500">Live submissions synced to database</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No leads found</h3>
            <p className="text-xs text-slate-400">Embed your calculators on your site to begin capturing high-intent leads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Lead Contact</th>
                  <th className="px-6 py-3.5">Calculator</th>
                  <th className="px-6 py-3.5">Snapshot Inputs</th>
                  <th className="px-6 py-3.5">Projected Result</th>
                  <th className="px-6 py-3.5 text-right">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const inputEntries = Object.entries(lead.inputs || {});
                  const resultEntries = Object.entries(lead.result || {});

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                          <Mail className="h-3.5 w-3.5 text-brand-600 flex-shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.name && (
                          <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                            <User className="h-3 w-3 text-slate-400" />
                            <span>{lead.name}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">{lead.calculatorTitle}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {inputEntries.map(([k, v]) => (
                            <span key={k} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-700">
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {resultEntries.map(([k, v]) => (
                            <span key={k} className="rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-brand-700">
                              {k}: {typeof v === "number" ? `$${v.toLocaleString()}` : String(v)}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right text-xs text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
