// Treści pomocy dla każdej sekcji formularza

interface QA {
  q: string;
  a: string;
}

interface HelpSection {
  title: string;
  description: string;
  examples: string[];
  tips: string[];
  qa?: QA[];
}

export const helpContent: Record<string, HelpSection> = {
  // WIZJA KWARTAŁU
  vision: {
    title: 'Wizja kwartału',
    description:
      'Opisz obrazowo jak będzie wyglądało Twoje życie po osiągnięciu celu. Użyj zmysłów - co zobaczysz, usłyszysz, poczujesz? Im bardziej konkretny obraz, tym silniejsza motywacja.',
    examples: [
      'Budzę się w poniedziałek z energią. Dashboard pokazuje 50 aktywnych klientów, zespół działa bez mojego udziału.',
      'Siedzę w kawiarni z laptopem, pracując 4h dziennie. Na koncie mam stabilne 30k MRR.',
      'Kończę pracę o 15:00, idę na siłownię. Firma generuje przychód bez moich interwencji.',
    ],
    tips: [
      'Pisz w czasie teraźniejszym, jakby to już się działo',
      'Skup się na uczuciach i efektach, nie na procesie',
      'Bądź konkretny - liczby, miejsca, sytuacje',
    ],
    qa: [
      { q: 'Czy to ma być długi tekst czy krótki?', a: '3-5 zdań wystarczy. Ważna jest konkretność, nie długość. Opisz jedną scenę z przyszłości.' },
      { q: 'Czy pisać o biznesie czy życiu prywatnym?', a: 'O tym, co jest Twoim celem na ten kwartał. Jeśli cel to więcej klientów - opisz jak wygląda dzień z 50 klientami.' },
      { q: 'Co jeśli nie wiem jak to będzie wyglądać?', a: 'Wyobraź sobie najlepszy możliwy scenariusz. Co CHCIAŁBYŚ żeby się wydarzyło? Pisz to.' },
      { q: 'Czy wizja musi być realistyczna?', a: 'Powinna być ambitna ale osiągalna w kwartale. To nie marzenie na 10 lat - to cel na 3 miesiące.' },
      { q: 'Po co w ogóle pisać wizję?', a: 'Mózg lepiej pracuje gdy ma konkretny obraz celu. Wizja to "zdjęcie" sukcesu - motywuje gdy jest trudno.' },
      { q: 'Jak napisać dobrą wizję?', a: 'Użyj zmysłów: co WIDZISZ, SŁYSZYSZ, CZUJESZ? Opisz konkretny dzień/scenę, nie abstrakcje. Np. "Budzę się bez alarmu, otwieram laptop..."' },
    ],
  },

  costOfInaction: {
    title: 'Cena zaniechania',
    description:
      'Co się stanie, jeśli NIE podejmiesz działania w tym kwartale? Jakie są realne konsekwencje odwlekania? To nie straszenie - to realistyczna ocena kosztów bezczynności.',
    examples: [
      'Zostaję na 7 klientach, wypalenie się pogłębia, frustracja rośnie',
      'Konkurencja wyprzedza, tracę window of opportunity, muszę zaczynać od zera',
      'Finanse się kurczą, zmuszony jestem wrócić do pracy na etacie',
      'Za 3 miesiące będę w tym samym miejscu, z tą samą frustracją',
      'Stracę zaufanie do siebie - kolejny kwartał bez postępu',
    ],
    tips: [
      'Bądź szczery - co NAPRAWDĘ się stanie?',
      'Pomyśl o konsekwencjach finansowych, emocjonalnych, relacyjnych',
      'To Twoja "away motivation" - siła odpychająca od status quo',
    ],
    qa: [
      { q: 'Czy to nie jest straszenie samego siebie?', a: 'To nie straszenie, a realistyczna ocena. Badania pokazują, że "away motivation" (ucieczka od bólu) jest silniejsza niż "toward motivation".' },
      { q: 'Co jeśli konsekwencje nie są dramatyczne?', a: 'Napisz prawdę. Może to znak, że cel nie jest tak ważny? Albo poszukaj głębiej - co tracisz przez odwlekanie?' },
      { q: 'Ile konsekwencji wymienić?', a: '2-3 najważniejsze. Skup się na tych, które najbardziej "bolą" - one będą motywować.' },
      { q: 'Jakie przykłady wpisać?', a: 'Np. "Zostanę na tym samym poziomie przychodów", "Stracę klienta X do konkurencji", "Wypalę się pracując w chaosie". Bądź konkretny.' },
    ],
  },

  braveAction: {
    title: 'Odważny ruch',
    description:
      'Co byś zrobił, gdybyś był PEWNY sukcesu? Jedno działanie, które wydaje się ryzykowne, ale może przynieść przełom. Strach przed tym działaniem to znak, że warto to rozważyć.',
    examples: [
      'Podniosę ceny o 50% dla nowych klientów',
      'Zadzwonię do 10 największych potencjalnych klientów w branży',
      'Opublikuję mój produkt publicznie, mimo że nie jest "idealny"',
      'Zatrudnię pierwszą osobę do zespołu',
      'Wyślę cold email do osoby, którą podziwiam, z propozycją współpracy',
    ],
    tips: [
      'Jeśli nie czujesz lekkiego strachu, to pewnie za mało odważne',
      'Pomyśl: "co bym zrobił, gdybym nie mógł ponieść porażki?"',
      'Często największy growth jest po drugiej stronie dyskomfortu',
    ],
    qa: [
      { q: 'Co jeśli odważny ruch jest za ryzykowny?', a: 'Odważny ≠ głupi. Chodzi o działanie poza strefą komfortu, nie o hazard. Jeśli coś może zniszczyć firmę - to nie odwaga.' },
      { q: 'Czy muszę to zrobić w tym kwartale?', a: 'Niekoniecznie wykonać, ale przynajmniej zaplanować lub rozpocząć. To kierunek, nie deadline.' },
      { q: 'Ile odważnych ruchów wpisać?', a: 'Jeden. Maksymalnie dwa. Więcej = rozproszenie. Wybierz ten, który da największy przełom.' },
      { q: 'Jakie są dobre przykłady odważnych ruchów?', a: 'Podnieść ceny, zadzwonić zamiast mailować, pokazać się publicznie (podcast, wystąpienie), poprosić o rekomendację, delegować kluczowe zadanie.' },
    ],
  },

  northStar: {
    title: 'North Star na kwartał',
    description:
      'Jedna kluczowa metryka, która najlepiej odzwierciedla sukces tego kwartału. Jeśli osiągniesz tylko tę jedną rzecz, uznasz kwartał za udany.',
    examples: [
      '25 nowych płacących klientów',
      '50 000 PLN przychodu miesięcznie (MRR)',
      'Produkt live z 100 aktywnych użytkowników',
      '3 zamknięte kontrakty B2B powyżej 10k',
      '10 000 subskrybentów newslettera',
    ],
    tips: [
      'Wybierz JEDNĄ metrykę - nie listę',
      'Musi być mierzalna i weryfikowalna',
      'Powinna być ambitna, ale osiągalna',
    ],
    qa: [
      { q: 'Czy to ma być liczba czy procent?', a: 'Liczba absolutna (np. "25 klientów"), nie procent. Procenty są dobre dla metryk wspierających, ale North Star to konkretna wartość.' },
      { q: 'Co jeśli mam kilka ważnych metryk?', a: 'Wybierz JEDNĄ najważniejszą. Pozostałe mogą być metrykami wspierającymi. North Star to kompas - może być tylko jeden.' },
      { q: 'Jak wybrać właściwą metrykę?', a: 'Zadaj sobie pytanie: "Gdybym osiągnął tylko to jedno, czy byłbym zadowolony z kwartału?" Jeśli tak - to Twój North Star.' },
      { q: 'Czy North Star może się zmienić w trakcie kwartału?', a: 'Nie powinien. Jeśli się zmienia, znaczy że nie wybrałeś właściwego. Przemyśl dobrze na początku.' },
      { q: 'Jaki format North Star jest najlepszy?', a: 'Konkretna liczba + jednostka. Np. "25 klientów", "50k PLN MRR", "100 aktywnych użytkowników". Unikaj "więcej klientów" - to nie jest mierzalne.' },
    ],
  },

  oneWord: {
    title: 'Jedno słowo',
    description:
      'Wybierz jedno słowo, które będzie Twoim kompasem na ten kwartał. Gdy staniesz przed trudną decyzją, zapytaj: "czy to wspiera moje słowo?"',
    examples: [
      'MOMENTUM - budowanie rozpędu i tempa',
      'FOCUS - bezwzględna koncentracja na priorytecie',
      'SCALE - skalowanie tego co już działa',
      'COURAGE - odwaga w trudnych decyzjach',
      'SYSTEMS - budowanie procesów i automatyzacji',
    ],
    tips: [
      'Wybierz słowo, które rezonuje emocjonalnie',
      'Zapisz je w widocznym miejscu',
      'Używaj go jako filtru decyzyjnego',
    ],
    qa: [
      { q: 'Czy mogą być dwa słowa?', a: 'Nie. Jedno. To ćwiczenie na fokus. Dwa słowa = brak priorytetu.' },
      { q: 'Czy może być po polsku?', a: 'Tak! SKUPIENIE, ODWAGA, WZROST - ważne żeby rezonowało z Tobą.' },
      { q: 'Jak używać tego słowa?', a: 'Przed każdą decyzją pytaj: "Czy to wspiera moje słowo?". Np. jeśli słowo to FOCUS, a ktoś prosi o spotkanie - czy to wspiera fokus?' },
      { q: 'Jakie słowa wybierają inni przedsiębiorcy?', a: 'EXECUTION, GROWTH, LEVERAGE, DEPTH, DISCIPLINE, MOMENTUM, SCALE. Wybierz to, które najlepiej opisuje czego POTRZEBUJESZ w tym kwartale.' },
    ],
  },

  goals: {
    title: 'Cele kwartału',
    description:
      'Maksymalnie 3 cele na kwartał. Każdy cel powinien mieć jasne uzasadnienie - DLACZEGO jest ważny i jak łączy się z większym obrazem.',
    examples: [
      'Cel: +25 płacących klientów | Dlaczego: fundament pod roczny target 100 klientów',
      'Cel: Zatrudnić pierwszą osobę | Dlaczego: delegacja = skalowalność',
      'Cel: System referralowy live | Dlaczego: organiczny wzrost bez reklam',
      'Cel: Zamknąć 3 kontrakty B2B | Dlaczego: wyższa średnia wartość klienta',
      'Cel: Wypuścić MVP produktu | Dlaczego: walidacja rynku przed większą inwestycją',
    ],
    tips: [
      'Mniej = więcej. 3 cele to maksimum',
      'Każdy cel powinien mieć mierzalny rezultat',
      '"Dlaczego" to Twoja motywacja gdy będzie trudno',
    ],
    qa: [
      { q: 'Czy mogę mieć więcej niż 3 cele?', a: 'NIE. To zasada. Więcej niż 3 = rozproszenie gwarantowane. Wybierz 3 najważniejsze, resztę odłóż.' },
      { q: 'Czy cele muszą być mierzalne?', a: 'TAK. "Być lepszym" to nie cel. "Zdobyć 10 klientów" to cel. Musisz wiedzieć czy osiągnąłeś.' },
      { q: 'Co wpisać w "dlaczego"?', a: 'Uzasadnienie biznesowe lub osobiste. Dlaczego TEN cel, a nie inny? Jak wpływa na roczny plan?' },
      { q: 'Czy cel może być jakościowy?', a: 'Może, ale dodaj mierzalny wskaźnik. Np. "Lepszy produkt" → "NPS wzrośnie z 30 do 50".' },
      { q: 'Jak sformułować dobry cel?', a: 'Użyj formuły: CZASOWNIK + LICZBA + RZECZ. Np. "Zdobyć 25 klientów", "Uruchomić 1 produkt", "Osiągnąć 50k MRR".' },
    ],
  },

  projects: {
    title: 'Projekty',
    description:
      'Projekty to konkretne inicjatywy, którym poświęcasz czas. Alokacja % pokazuje ile czasu w tygodniu przeznaczasz na każdy projekt. Suma powinna = 100%.',
    examples: [
      'Sales & Onboarding (50%) - główny driver wzrostu',
      'Product Development (30%) - ulepszanie produktu',
      'Hiring & Team (20%) - budowanie zespołu',
      'Marketing & Content (40%) - budowanie widoczności',
      'Automatyzacje (25%) - odzyskiwanie czasu',
    ],
    tips: [
      'Maksymalnie 3 aktywne projekty jednocześnie',
      'Jeśli coś nie ma 20%+ czasu, odłóż to',
      'Bądź brutalnie szczery ile REALNIE możesz poświęcić',
    ],
    qa: [
      { q: 'Ile projektów mogę mieć?', a: 'Maksymalnie 3. Jeden główny (40-60%) i dwa wspierające. Więcej = żaden nie dostanie wystarczająco uwagi.' },
      { q: 'Co jeśli suma nie wychodzi 100%?', a: 'Musisz dostosować. 100% to Twój pełny czas na te projekty. Jeśli suma > 100%, kłamiesz sam przed sobą.' },
      { q: 'Czy "operacje" to projekt?', a: 'Nie. Projekty to inicjatywy z końcem. Operacje to rutyna. Tu wpisz tylko projekty rozwojowe.' },
      { q: 'Jak określić % czasu?', a: 'Policz godziny tygodniowo. Jeśli pracujesz 40h i chcesz 20h na Sales - to 50%.' },
      { q: 'Jakie projekty wpisać?', a: 'Projekty rozwojowe: Sales, Marketing, Product, Hiring, Automatyzacje. NIE wpisuj: "obsługa klienta" czy "admin" - to operacje, nie projekty.' },
    ],
  },

  milestones: {
    title: 'Kamienie milowe',
    description:
      'Co MUSI być zrobione w każdym miesiącu kwartału? To Twoje checkpointy - jeśli je osiągniesz, jesteś na dobrej drodze.',
    examples: [
      'Miesiąc 1: +8 klientów, job post live, 3 kandydatów w pipeline',
      'Miesiąc 2: +8 klientów, pierwsza osoba zatrudniona, referral beta live',
      'Miesiąc 3: +9 klientów, onboarding nowej osoby zakończony, referral system live',
      'Miesiąc 1: MVP gotowy, 10 beta testerów, feedback zebrany',
      'Miesiąc 2: wersja 1.0 live, 50 użytkowników, pierwsze płatności',
    ],
    tips: [
      'Rozłóż cel równomiernie na 3 miesiące',
      'Dodaj konkretne liczby gdzie możliwe',
      'Uwzględnij zależności między działaniami',
    ],
    qa: [
      { q: 'Czy muszę rozłożyć cel równo na 3 miesiące?', a: 'Nie musi być równo. Może być 20%-30%-50% jeśli tak pasuje. Ważne żeby było realistyczne.' },
      { q: 'Co jeśli nie wiem co będzie w miesiącu 3?', a: 'Napisz najlepsze przypuszczenie. Plan to hipoteza - możesz go korygować co miesiąc.' },
      { q: 'Ile kamieni milowych na miesiąc?', a: '2-4 konkretne rezultaty. Nie lista zadań, ale efekty które można "odkliknąć".' },
      { q: 'Jak pisać kamienie milowe?', a: 'Jako rezultaty, nie działania. NIE: "Pracować nad marketingiem". TAK: "10 postów opublikowanych, 500 nowych followersów".' },
    ],
  },

  metrics: {
    title: 'Metryki sukcesu',
    description:
      'Jak zmierzysz sukces? Jakie konkretne KPI pokażą, że osiągasz cel? Wybierz 2-3 metryki, które będziesz śledzić co tydzień.',
    examples: [
      'Nowi klienci w kwartale | Target: 25',
      'Demo → Klient conversion | Target: 30%',
      'Churn rate miesięczny | Target: <5%',
      'MRR (Monthly Recurring Revenue) | Target: 50 000 PLN',
      'Liczba leadów tygodniowo | Target: 20',
    ],
    tips: [
      'Wybierz metryki, które możesz kontrolować',
      'Lead measures > lag measures (działania > wyniki)',
      'Śledź je co tydzień, nie tylko na koniec kwartału',
    ],
    qa: [
      { q: 'Czym różni się metryka od North Star?', a: 'North Star to JEDNA główna metryka. Tu możesz mieć 2-3 wspierające, które pomagają śledzić postęp.' },
      { q: 'Co to lead vs lag measure?', a: 'Lead = działanie (np. "liczba telefonów dziennie"). Lag = wynik (np. "podpisane umowy"). Lead measures dają kontrolę.' },
      { q: 'Jak często śledzić metryki?', a: 'Co tydzień minimum. Najlepiej codziennie dla lead measures. Lag measures raz na tydzień.' },
      { q: 'Co jeśli nie mam danych?', a: 'Zacznij zbierać. Ustaw prosty sposób mierzenia. Bez danych nie wiesz czy idziesz w dobrą stronę.' },
      { q: 'Jakie metryki śledzić?', a: 'Zależy od celu: sprzedaż (leady, demo, konwersja), produkt (użytkownicy, retencja, NPS), marketing (zasięg, CTR, cost per lead).' },
    ],
  },

  risks: {
    title: 'Pre-mortem: Ryzyka',
    description:
      'Wyobraź sobie, że jest koniec kwartału i cel NIE został osiągnięty. Co poszło nie tak? Zidentyfikuj 3 główne ryzyka i przygotuj działania ochronne.',
    examples: [
      'Ryzyko: Brak kandydatów do pracy | Ochrona: Aktywny outreach na LinkedIn od tygodnia 1',
      'Ryzyko: Churn obecnych klientów | Ochrona: Weekly check-in z top 5 klientami',
      'Ryzyko: Wypalenie przy 50h/tydzień | Ochrona: Blok regeneracji w środy, max 40h',
      'Ryzyko: Brak leadów | Ochrona: Content marketing + 3 posty tygodniowo',
      'Ryzyko: Opóźnienie w projekcie | Ochrona: Weekly review + buffer 20% czasu',
    ],
    tips: [
      'Pre-mortem to jedna z najskuteczniejszych technik planowania',
      'Nie ignoruj "oczywistych" ryzyk - one najczęściej się materializują',
      'Każde ryzyko MUSI mieć konkretną mitygację',
    ],
    qa: [
      { q: 'Co to jest pre-mortem?', a: 'Technika planowania: wyobrażasz sobie że PRZEGRAŁEŚ i analizujesz dlaczego. Badania pokazują że to skuteczniejsze niż myślenie o sukcesie.' },
      { q: 'Ile ryzyk wpisać?', a: '2-3 główne. Więcej = paraliż. Skup się na tych, które mają największe prawdopodobieństwo i wpływ.' },
      { q: 'Co jeśli ryzyko się zmaterializuje mimo mitygacji?', a: 'Plan B. Ale najpierw daj mitygacji szansę. Większość ryzyk można zmniejszyć dobrym przygotowaniem.' },
      { q: 'Jakie są typowe ryzyka?', a: 'Brak czasu, brak leadów, churn klientów, wypalenie, opóźnienia w projekcie, problemy z zespołem, zmiany na rynku. Wybierz te najbardziej prawdopodobne dla CIEBIE.' },
    ],
  },

  ifThenRules: {
    title: 'Reguły If-Then',
    description:
      'Automatyczne reakcje na trudne sytuacje. Gdy X się wydarzy, zrobię Y. To "skrypty zachowań" - nie musisz podejmować decyzji w momencie stresu.',
    examples: [
      'Jeśli czuję się przytłoczony → Zamykam laptop, 20min spacer, wracam do 1 zadania',
      'Jeśli klient prosi o custom feature → Mówię: sprawdzę czy pasuje do roadmapy, dam znać jutro',
      'Jeśli nie wiem od czego zacząć dzień → Otwieram listę TOP 3 priorytetów i robię pierwsze',
      'Jeśli ktoś proponuje spotkanie → Pytam: czy to można załatwić asynchronicznie?',
      'Jeśli pracuję ponad 8h → Kończę, jutro będę bardziej efektywny',
    ],
    tips: [
      'Pisz konkretne, wykonalne akcje',
      'Reguły działają najlepiej dla powtarzających się sytuacji',
      'Testuj i modyfikuj - nie wszystkie zadziałają od razu',
    ],
    qa: [
      { q: 'Po co mi reguły If-Then?', a: 'Oszczędzają energię mentalną. Zamiast decydować w stresie, masz gotowy scenariusz. To jak autopilot dla trudnych sytuacji.' },
      { q: 'Ile reguł powinienem mieć?', a: '3-5 na kwartał. Więcej nie zapamiętasz. Wybierz sytuacje, które najczęściej Cię blokują.' },
      { q: 'Czy mogę zmienić regułę w trakcie kwartału?', a: 'Tak! Testuj i dostosowuj. Jeśli reguła nie działa - zmień "then" na inną akcję.' },
      { q: 'Jakie sytuacje wybrać do reguł?', a: 'Te, które Cię regularnie blokują: prokrastynacja, przytłoczenie, prośby innych, rozpraszacze, trudne rozmowy. Obserwuj co Cię zatrzymuje.' },
    ],
  },

  stopDoing: {
    title: 'Stop-Doing',
    description:
      'Co ŚWIADOMIE odkładasz na później? Które aktywności, projekty lub zobowiązania musisz porzucić, żeby mieć czas na priorytet? Każde "tak" wymaga wielu "nie".',
    examples: [
      'Darmowe konsultacje i "szybkie pytania"',
      'Niestandardowe integracje i custom development',
      'Weekendowa praca (poza emergencies)',
      'Social media przed 12:00',
      'Spotkania bez agendy - odmawiam lub proszę o agendę',
    ],
    tips: [
      'To nie jest "może później" - to jest świadome NIE',
      'Poinformuj innych o tych decyzjach',
      'Zapisz gdzie indziej pomysły na przyszłość',
    ],
    qa: [
      { q: 'Czy to znaczy że już nigdy tego nie zrobię?', a: 'Nie. To znaczy że NIE W TYM KWARTALE. Odkładasz świadomie, żeby mieć czas na priorytety.' },
      { q: 'Co jeśli ktoś mnie poprosi o coś z listy?', a: 'Masz gotową odpowiedź: "W tym kwartale skupiam się na X, wracam do tego w Q2". Łatwiej odmówić z planem.' },
      { q: 'Ile rzeczy wpisać?', a: '3-5. To musi być konkretne. "Wszystko co rozprasza" to nie jest wpis. "Social media przed 12:00" - tak.' },
      { q: 'Co wpisać na Stop-Doing?', a: 'Rzeczy które ROBISZ ale nie powinieneś: darmowa praca, odpowiadanie na każdy email od razu, spotkania bez celu, scrollowanie social media, perfekcjonizm.' },
    ],
  },

  capacity: {
    title: 'Capacity',
    description:
      'Ile REALNYCH godzin tygodniowo możesz poświęcić na realizację celu? Bądź brutalnie szczery - nie plan, ale rzeczywistość.',
    examples: [
      '5-10h/tydzień = projekt poboczny, side hustle',
      '15-20h/tydzień = poważne part-time, przed/po pracy',
      '30-40h/tydzień = full-time focus na cel',
      '40-50h/tydzień = intensywny tryb, uwaga na wypalenie',
      '50-60h/tydzień = sprint mode, max 4-6 tygodni',
    ],
    tips: [
      'Odejmij: spotkania, admin, życie prywatne',
      'Lepiej niedoszacować niż przeszacować',
      'Capacity wpływa na realistyczność celów',
    ],
    qa: [
      { q: 'Czy wliczać spotkania?', a: 'NIE. Capacity to czas na PRACĘ nad celem, nie na spotkania i admin. Bądź brutalnie szczery.' },
      { q: 'Co jeśli moje capacity jest niskie?', a: 'Dostosuj cele. 10h/tyg to za mało na "zdobyć 50 klientów". Może "zdobyć 10 klientów" jest realistyczne?' },
      { q: 'Czy mogę zwiększyć capacity w trakcie kwartału?', a: 'Możesz, ale ryzykowne. Lepiej zaplanować konserwatywnie i ewentualnie przyspieszyć niż wypalić się w miesiącu 1.' },
      { q: 'Jak policzyć swoje realne capacity?', a: 'Przez tydzień notuj ile FAKTYCZNIE pracujesz nad celem (nie scrollujesz, nie "myślisz o pracy"). To Twoje realne capacity.' },
    ],
  },

  retrospective: {
    title: 'Retrospektywa',
    description:
      'Zanim zaplanujemy przyszłość, podsumujmy co się wydarzyło. Uczciwa analiza poprzedniego okresu to fundament dobrego planu.',
    examples: [
      'Cel był +20 klientów, zrobiłem +12. Dlaczego? Za mało leadów w miesiącu 1.',
      'Zadziałało: cold calling, nie zadziałało: reklamy na FB - za wysoki CPC.',
      'Największa lekcja: powinienem był zatrudnić wcześniej, robiłem za dużo sam.',
      'Co bym zrobił inaczej: zacząłbym od jednego kanału, nie trzech.',
      'Sukces: system referralowy - 30% nowych klientów z poleceń.',
    ],
    tips: [
      'Bądź szczery - nikt tego nie ocenia',
      'Skup się na faktach i liczbach',
      'Szukaj wzorców, nie pojedynczych zdarzeń',
    ],
    qa: [
      { q: 'Po co robić retrospektywę?', a: 'Żeby nie powtarzać błędów. Ludzie planują przyszłość ignorując przeszłość - to recepta na te same problemy.' },
      { q: 'Czy muszę być krytyczny wobec siebie?', a: 'Bądź SZCZERY, nie krytyczny. Fakty bez osądzania. "Zrobiłem X, efekt był Y" - to wszystko.' },
      { q: 'Co jeśli poprzedni kwartał był zły?', a: 'Tym bardziej ważna retrospektywa. Co nie zadziałało? Dlaczego? Co zrobisz inaczej?' },
      { q: 'Co wpisać w retrospektywę?', a: 'Fakty: co planowałeś vs co osiągnąłeś, co zadziałało, co nie zadziałało, największa lekcja, co byś zrobił inaczej.' },
    ],
  },

  annualPlan: {
    title: 'Plan roczny',
    description:
      'Kierunek na cały rok. Kwartalne cele powinny być krokami do rocznej wizji. Bez szerszego kontekstu łatwo zagubić się w szczegółach.',
    examples: [
      'Wizja roczna: Rentowny biznes z 3-osobowym zespołem, 100k ARR, praca 30h/tydzień',
      'North Star roczny: 100 płacących klientów (obecnie: 25)',
      'Cel roczny: Osiągnąć 500k przychodu, zatrudnić 2 osoby, uruchomić drugi produkt',
      'Cel roczny: Przejść z freelancera do agencji - 5 stałych klientów, 1 pracownik',
      'Cel roczny: Zwalidować produkt, osiągnąć product-market fit, 1000 użytkowników',
    ],
    tips: [
      '1 zdanie wizji > długi opis',
      'Wybierz 3 cele max na rok',
      'North Star to JEDNA liczba, nie lista',
    ],
    qa: [
      { q: 'Czy muszę mieć plan roczny?', a: 'Pomaga, ale nie jest wymagany. Plan kwartalny może działać samodzielnie. Roczny daje szerszy kontekst.' },
      { q: 'Jak powiązać plan kwartalny z rocznym?', a: 'Kwartalne cele powinny być "kawałkami" celu rocznego. Np. roczny: 100 klientów → Q1: 25, Q2: 25, itd.' },
      { q: 'Co jeśli nie wiem co będzie za rok?', a: 'Napisz kierunek, nie szczegóły. "Zbudować rentowny biznes z 100k ARR" - to wystarczy.' },
      { q: 'Jak napisać dobrą wizję roczną?', a: 'Opisz stan docelowy: przychód, zespół, styl pracy, produkt. Np. "100k ARR, 3-osobowy zespół, praca 30h/tyg, 2 produkty live".' },
    ],
  },
};

export type HelpContentKey = keyof typeof helpContent;
