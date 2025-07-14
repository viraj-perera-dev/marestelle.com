import { headers } from "next/headers";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import PaymentSuccessComponent from "./components/paymentSuccess";

export default async function PaymentSuccess() {
  const headersList = headers();
  const searchParams = new URLSearchParams(
    headersList.get("x-forwarded-url")?.split("?")[1] || ""
  );
  const bookingId = searchParams.get("booking_id");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Pagamento Completato! 🎉
            </h1>
            <p className="text-gray-600">
              La tua prenotazione è stata confermata con successo.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Cosa succede ora?
            </h2>
            <ul className="text-sm text-green-700 space-y-2 text-left">
              <li>✅ Riceverai un'email di conferma a breve</li>
              <li>✅ Porta un documento di identità</li>
              <li>✅ Arriva 15 minuti prima dell'orario</li>
            </ul>
          </div>

          {bookingId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>ID Prenotazione:</strong> #{bookingId}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Torna alla Homepage
              </Link>
              <Link
                href="/contatti"
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Contattaci
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <PaymentSuccessComponent />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Grazie per aver scelto Marestelle 🌊
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
