'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchBookings = async (page) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    // Get paginated data
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("confirmed", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="flex items-center gap-1 text-yellow-500">
            <ClockIcon className="w-4 h-4" /> Pending
          </span>
        );
      case 1:
        return (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircleIcon className="w-4 h-4" /> Confirmed
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 text-red-500">
            <XCircleIcon className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return "Unknown";
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Message</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Paid</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 whitespace-nowrap">{booking.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex gap-2 items-center">
                  <a href={`mailto:${booking.email}`} className="text-blue-500 hover:text-blue-700">
                    <MailIcon className="w-4 h-4" />
                  </a>
                  <a href={`tel:${booking.phone}`} className="text-green-500 hover:text-green-700">
                    <PhoneIcon className="w-4 h-4" />
                  </a>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {booking.date}{" "}
                {booking.time && (
                  <span className="text-xs text-gray-400">({booking.time})</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap max-w-xs truncate">
                {booking.message || (
                  <span className="text-gray-400 italic">No message</span>
                )}
              </td>
              <td className="px-4 py-3">
                {booking.paid ? "💰" : <span className="text-gray-400">–</span>}
              </td>
              <td className="px-4 py-3">{renderStatus(booking.confirmed)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-100 text-sm rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-100 text-sm rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
