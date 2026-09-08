import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Send, CheckCircle2, Clock } from 'lucide-react';
import { CustomerReviewStatus } from '../types';

export const CustomersView: React.FC = () => {
  const { customers, setAddCustomerModalOpen, sendCustomerInvite } = useApp();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const getStatusBadge = (status: CustomerReviewStatus) => {
    switch (status) {
      case 'Reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Reviewed
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-3 h-3 text-blue-600" />
            Sent
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your customer list and track who has received or completed a Google review.
          </p>
        </div>

        <button
          onClick={() => setAddCustomerModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Search & Info bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs transition-colors"
          />
        </div>

        <span className="text-xs text-slate-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </span>
      </div>

      {/* Clean, Simple Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Date Visited</th>
                <th className="py-3.5 px-6 text-center">Review Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {customer.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono">
                      {customer.phone}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {customer.dateVisited}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {customer.status === 'Pending' ? (
                        <button
                          onClick={() => sendCustomerInvite(customer.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Invite</span>
                        </button>
                      ) : customer.status === 'Sent' ? (
                        <button
                          onClick={() => sendCustomerInvite(customer.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                        >
                          <span>Resend SMS</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
