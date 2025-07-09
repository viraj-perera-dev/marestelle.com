"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  MessageSquare,
  Banknote,
} from "lucide-react";

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const renderStatus = (status, paid) => {
    switch (status) {
      case 0:
        return (
          <span className="flex items-center gap-1 text-yellow-500">
            <ClockIcon className="w-4 h-4" />
          </span>
        );
      case 1:
        return (
          <span className={`${paid ? "text-green-600" : "text-blue-600"} flex items-center gap-1`}>
            <CheckCircleIcon className="w-4 h-4" />
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 text-red-500">
            <XCircleIcon className="w-4 h-4" />
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Stato
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Contatti
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Tour
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Messaggio
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Pagato
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Persone
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Bambini
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Prezzo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
              Gestisci
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">{renderStatus(booking.confirmed, booking.paid)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{booking.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex flex-col gap-2 items-star">
                  <a
                    href={`tel:${booking.phone}`}
                    className="text-green-500 hover:text-green-700 flex gap-2 items-center "
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {booking.phone}
                  </a>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-blue-500 hover:text-blue-700 flex gap-2 items-center"
                  >
                    <MailIcon className="w-4 h-4" />
                    {booking.email}
                  </a>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(booking.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {booking.time === "afternoon" ? (
                  <span className="text-orange-400">PM</span>
                ) : (
                  <span className="text-yellow-600">AM</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap max-w-xs truncate">
                {booking.message ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMessage(booking.message)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer flex gap-2 items-center"
                      title="View full message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">–</span>
                )}
              </td>

              <td className="px-4 py-3">
                {booking.paid ? (
                  <Banknote className="text-green-500 w-4 h-4" />
                ) : (
                  <Banknote className="text-red-500 w-4 h-4" />
                )}
              </td>
              <td className="px-4 py-3">{booking.people}</td>
              <td className="px-4 py-3">{booking.children}</td>
              <td className="px-4 py-3">{booking.price} €</td>
              <td className="px-4 py-3">
                {booking.confirmed === 0 ? (
                  <div className="flex gap-2 items-center justify-center">
                    <button className="px-3 rounded-md text-white bg-green-500 hover:bg-green-600 cursor-pointer flex gap-2 items-center">
                      Accetta
                    </button>
                    <button className="px-3 rounded-md text-white bg-red-500 hover:bg-red-600 cursor-pointer flex gap-2 items-center">
                      Rifiuta
                    </button>
                  </div>
                ) : booking.confirmed === 1 && booking.paid === true ? (
                  <span className="text-green-500">Pagato</span>
                ) : booking.confirmed === 1 && booking.paid === false ? (
                  <span className="text-blue-500">Non Pagato</span>
                ) : (
                  <span className="text-red-500">Rifiutato</span>
                )}
              </td>
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

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 glassmorphism flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg px-6 pb-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold my-3 text-neutral-600">
              Message Detail
            </h2>
            <hr className="my-2 border-gray-200 w-2/3" />
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
