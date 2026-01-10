'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-night-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Powrót do aplikacji
        </Link>

        {/* Content */}
        <div className="bg-white dark:bg-night-900 rounded-2xl border border-slate-200 dark:border-night-800 p-8 shadow-sm">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Polityka Prywatności
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Ostatnia aktualizacja: 30 grudnia 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              1. Informacje ogólne
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Aplikacja Kwartal (dalej: &quot;Aplikacja&quot;) jest narzędziem do planowania kwartalnego i rocznego,
              stworzoną przez MasterZone (dalej: &quot;my&quot;, &quot;nas&quot;). Szanujemy Twoją prywatność i
              zobowiązujemy się do ochrony Twoich danych osobowych.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              2. Jakie dane zbieramy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              W zależności od sposobu korzystania z Aplikacji, możemy zbierać:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li><strong>Bez konta:</strong> Twoje plany są przechowywane wyłącznie lokalnie w przeglądarce (localStorage). Nie mamy do nich dostępu.</li>
              <li><strong>Z kontem:</strong> Adres email, imię (opcjonalnie), oraz treść Twoich planów kwartalnych i profilu.</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              3. Jak wykorzystujemy dane
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Twoje dane wykorzystujemy wyłącznie w celu:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li>Umożliwienia synchronizacji planów między urządzeniami</li>
              <li>Przechowywania historii Twoich planów</li>
              <li>Wysyłania emaili związanych z kontem (weryfikacja, reset hasła)</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              <strong>Nie sprzedajemy ani nie udostępniamy Twoich danych osobom trzecim.</strong>
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              4. Bezpieczeństwo danych
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Stosujemy następujące zabezpieczenia:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li>Szyfrowanie transmisji (HTTPS/TLS)</li>
              <li>Szyfrowanie danych w bazie (AES-256)</li>
              <li>Row Level Security - dostęp tylko do własnych danych</li>
              <li>Bezpieczne przechowywanie haseł (bcrypt)</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              5. Twoje prawa (RODO)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Zgodnie z RODO masz prawo do:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li><strong>Dostępu</strong> - możesz pobrać swoje dane w formacie Markdown lub PDF</li>
              <li><strong>Sprostowania</strong> - możesz edytować swoje dane w profilu</li>
              <li><strong>Usunięcia</strong> - możesz usunąć swoje konto w ustawieniach</li>
              <li><strong>Przenoszenia</strong> - możesz wyeksportować wszystkie swoje plany</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              6. Usługi zewnętrzne
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Korzystamy z następujących usług zewnętrznych:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li><strong>Supabase</strong> - hosting bazy danych i autoryzacja (zgodność z RODO)</li>
              <li><strong>Vercel</strong> - hosting aplikacji webowej (zgodność z RODO)</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              7. Pliki cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Używamy wyłącznie niezbędnych plików cookies do obsługi sesji logowania.
              Nie używamy cookies marketingowych ani analitycznych.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              8. Przechowywanie danych
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Twoje dane przechowujemy przez czas korzystania z konta. Po usunięciu konta,
              wszystkie dane są trwale usuwane w ciągu 30 dni.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              9. Kontakt
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              W sprawach związanych z prywatnością możesz się z nami skontaktować:
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Email: <a href="mailto:kontakt@masterzone.edu.pl" className="text-ember-500 hover:text-ember-600">kontakt@masterzone.edu.pl</a>
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              10. Zmiany w polityce
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              O istotnych zmianach w polityce prywatności poinformujemy użytkowników
              poprzez email lub powiadomienie w aplikacji.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
