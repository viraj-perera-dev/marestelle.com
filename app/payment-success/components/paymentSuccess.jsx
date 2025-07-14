"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!bookingId) return;

      // Mark booking as paid
      const { error } = await supabase
        .from("bookings")
        .update({ paid: true })
        .eq("id", bookingId);

      if (!error) {
        console.log("✅ Booking marked as paid");
        try {
          const response = await fetch("/api/send-payment-success-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId }),
          });

          const data = await response.json();

          if (response.ok) {
            console.log("✅ Payment success emails sent");
          } else {
            console.error("❌ Error sending payment success emails:", data.error);
          }
        } catch (err) {
          console.error("❌ API call error:", err.message);
        }
      } else {
        console.error("❌ Failed to update booking:", error);
      }
    };

    confirmPayment();
  }, [bookingId]);

  return;
}
