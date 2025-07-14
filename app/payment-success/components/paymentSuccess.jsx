"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { headers } from "next/headers";


export default function PaymentSuccessComponent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const bookingId = headers().get("booking_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setIsProcessing(false);
        return;
      }

      console.log("🔄 Processing payment success for booking:", bookingId);

      try {
        // Mark booking as paid in Supabase
        const { error: updateError } = await supabase
          .from("bookings")
          .update({ paid: true })
          .eq("id", bookingId);

        if (updateError) {
          console.error("❌ Failed to update booking:", updateError);
          setError("Failed to update booking status");
          setIsProcessing(false);
          return;
        }

        console.log("✅ Booking marked as paid");

        // Send payment success emails
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
          setError("Failed to send confirmation emails");
        }
      } catch (err) {
        console.error("❌ API call error:", err.message);
        setError("Network error occurred");
      } finally {
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [bookingId]);

  // You can optionally return a loading state or error message
  if (isProcessing) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        Processing payment confirmation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return null; // Component doesn't render anything visually when successful
}