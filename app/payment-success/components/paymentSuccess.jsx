"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessComponent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  
  // Single mounted ref to track component lifecycle
  const isMountedRef = useRef(false);
  const hasProcessedRef = useRef(false);

  // Memoized safe state setter
  const safeSetState = useCallback((setter) => {
    if (isMountedRef.current) {
      setter();
    }
  }, []);

  const confirmPayment = useCallback(async () => {
    // Prevent multiple executions and check if component is mounted
    if (hasProcessedRef.current || !bookingId || !isMountedRef.current) {
      if (!bookingId && isMountedRef.current) {
        safeSetState(() => setError("No booking ID provided"));
      }
      safeSetState(() => setIsProcessing(false));
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

      // Always check mount status before any state updates
      if (!isMountedRef.current) return;

      if (updateError) {
        console.error("❌ Failed to update booking:", updateError);
        safeSetState(() => {
          setError("Failed to update booking status");
          setIsProcessing(false);
        });
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

      if (!isMountedRef.current) return;

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Payment success emails sent");
      } else {
        console.error("❌ Error sending payment success emails:", data.error);
        safeSetState(() => setError("Failed to send confirmation emails"));
      }
    } catch (err) {
      console.error("❌ API call error:", err.message);
      if (isMountedRef.current) {
        safeSetState(() => setError("Network error occurred"));
      }
    } finally {
      safeSetState(() => setIsProcessing(false));
    }
  }, [bookingId, safeSetState]);

  // Single effect to handle mounting and payment processing
  useEffect(() => {
    isMountedRef.current = true;
    
    // Only process if we have booking ID and haven't processed yet
    if (bookingId && !hasProcessedRef.current) {
      // Use setTimeout to ensure this runs after the current render cycle
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          confirmPayment();
        }
      }, 0);

      return () => {
        clearTimeout(timer);
        isMountedRef.current = false;
      };
    } else if (!bookingId) {
      // Handle no booking ID case
      setError("No booking ID provided");
      setIsProcessing(false);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [bookingId, confirmPayment]);

  // Early return - no render if not processing and no error
  if (!isProcessing && !error) {
    return null;
  }

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