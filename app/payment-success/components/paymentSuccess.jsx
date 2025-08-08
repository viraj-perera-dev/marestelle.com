"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessComponent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const hasProcessedRef = useRef(false);

  const confirmPayment = useCallback(async () => {
    // Prevent multiple executions
    if (hasProcessedRef.current || !bookingId) {
      if (!bookingId) {
        setError("No booking ID provided");
      }
      setIsProcessing(false);
      return;
    }

    hasProcessedRef.current = true;
    console.log("🔄 Processing payment success for booking:", bookingId);

    try {
      // Mark booking as paid in Supabase
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ paid: true })
        .eq("id", bookingId);

      // Check if component is still mounted before state updates
      if (!isMountedRef.current) return;

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

      // Check if component is still mounted before state updates
      if (!isMountedRef.current) return;

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Payment success emails sent");
      } else {
        console.error("❌ Error sending payment success emails:", data.error);
        setError("Failed to send confirmation emails");
      }
    } catch (err) {
      console.error("❌ API call error:", err.message);
      // Check if component is still mounted before state updates
      if (!isMountedRef.current) return;
      setError("Network error occurred");
    } finally {
      // Check if component is still mounted before state updates
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [bookingId]);

  useEffect(() => {
    // Reset mounted ref
    isMountedRef.current = true;
    
    // Only run if we have a bookingId and haven't processed yet
    if (bookingId && !hasProcessedRef.current) {
      confirmPayment();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [confirmPayment, bookingId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (isProcessing) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50">
        Processing payment confirmation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        Error: {error}
      </div>
    );
  }

  return null;
}