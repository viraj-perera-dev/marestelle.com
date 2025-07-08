"use client";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import BookingsTable from "./BookingsTable";
import Image from "next/image";

export default function DashboardClient() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchProfile() {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
      setLoadingProfile(false);
    }

    fetchProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Image
                priority
                src="/assets/logo/logo_max_white.png"
                className={`md:w-30 h-auto object-contain invert`}
                alt="cloud"
                width={500}
                height={500}
              />
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Bentornato, {loadingProfile ? "Loading..." : profile?.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <BookingsTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
