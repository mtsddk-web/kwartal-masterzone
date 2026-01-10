'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
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
            Regulamin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Ostatnia aktualizacja: 30 grudnia 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              1. Postanowienia ogólne
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Niniejszy regulamin określa zasady korzystania z aplikacji Kwartal (dalej: &quot;Aplikacja&quot;),
              stworzonej przez MasterZone z siedzibą w Polsce (dalej: &quot;Usługodawca&quot;).
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Korzystając z Aplikacji, akceptujesz niniejszy regulamin w całości.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              2. Opis usługi
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Aplikacja Kwartal to narzędzie do:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li>Planowania celów kwartalnych i rocznych</li>
              <li>Prowadzenia retrospektyw</li>
              <li>Definiowania wizji i strategii osobistej</li>
              <li>Eksportu planów do formatu PDF i Markdown</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              3. Konto użytkownika
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Aplikacja może być używana:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li><strong>Bez konta</strong> - dane przechowywane lokalnie w przeglądarce</li>
              <li><strong>Z kontem</strong> - synchronizacja między urządzeniami, historia planów</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Tworząc konto, zobowiązujesz się do podania prawdziwych danych i zachowania
              poufności hasła.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              4. Zasady korzystania
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Użytkownik zobowiązuje się do:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-2">
              <li>Korzystania z Aplikacji zgodnie z jej przeznaczeniem</li>
              <li>Niepodejmowania działań mogących zakłócić działanie Aplikacji</li>
              <li>Nienaruszania praw innych użytkowników</li>
              <li>Niepublikowania treści niezgodnych z prawem</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              5. Własność intelektualna
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Wszelkie prawa do Aplikacji, w tym kod źródłowy, design i treści,
              należą do Usługodawcy. Użytkownik zachowuje pełne prawa do treści
              utworzonych przez siebie (planów, celów, notatek).
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              6. Dostępność usługi
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Usługodawca dokłada starań, aby Aplikacja była dostępna 24/7.
              Nie gwarantujemy jednak nieprzerwanej dostępności i zastrzegamy
              prawo do przerw technicznych.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              7. Odpowiedzialność
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Aplikacja jest narzędziem do planowania osobistego. Usługodawca
              nie ponosi odpowiedzialności za decyzje podjęte na podstawie
              planów stworzonych w Aplikacji.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Odpowiedzialność Usługodawcy jest ograniczona do wartości
              ewentualnie uiszczonych opłat za usługę.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              8. Bezpłatność usługi
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Aplikacja jest obecnie udostępniana bezpłatnie. Usługodawca zastrzega
              prawo do wprowadzenia płatnych funkcji w przyszłości, z zachowaniem
              bezpłatnego dostępu do podstawowych funkcjonalności.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              9. Usunięcie konta
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Użytkownik może w każdej chwili usunąć swoje konto w ustawieniach
              profilu. Usunięcie konta powoduje trwałe usunięcie wszystkich
              danych użytkownika.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              10. Zmiany regulaminu
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Usługodawca zastrzega prawo do zmiany regulaminu. O istotnych zmianach
              użytkownicy zostaną poinformowani poprzez email lub powiadomienie
              w Aplikacji z 14-dniowym wyprzedzeniem.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              11. Prawo właściwe
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Niniejszy regulamin podlega prawu polskiemu. Wszelkie spory będą
              rozstrzygane przez sądy właściwe dla siedziby Usługodawcy.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
              12. Kontakt
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              W sprawach związanych z regulaminem możesz się z nami skontaktować:
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Email: <a href="mailto:kontakt@masterzone.edu.pl" className="text-ember-500 hover:text-ember-600">kontakt@masterzone.edu.pl</a>
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-slate-500 dark:text-slate-400 hover:text-ember-500 text-sm"
          >
            Polityka Prywatności
          </Link>
        </div>
      </div>
    </div>
  );
}
