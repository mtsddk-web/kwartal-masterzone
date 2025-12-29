// ============================================
// RETROSPEKTYWA (Sekcja A z MasterClarity)
// ============================================

export interface Retrospective {
  // A1. Fakty i wyniki
  previousGoals: string; // 3 główne cele z poprzedniego okresu
  delivered: string; // Co realnie dowiezione (3-5 konkretów)
  notDelivered: string; // Czego nie dowieziono
  keyNumber: string; // Jedna liczba opisująca okres

  // A2. Co działało
  whatWorked: string; // Najlepiej działające elementy
  bestHabits: string; // Nawyki z największym wpływem

  // A3. Wzorce i przeszkody
  recurringProblems: string; // Powtarzające się problemy
  obstacles: string; // Najczęstsze przeszkody
  biggestMistake: string; // Najdroższa pomyłka/lekcja

  // A5. Decyzje zamykające
  stop: string[]; // STOP - co kończycie (max 3)
  continue: string[]; // CONTINUE - co zostaje (max 3)
  start: string; // START - nowa zasada
  openLoops: string[]; // Otwarte pętle do domknięcia (2)
}

// ============================================
// CELE ROCZNE (Sekcja B z MasterClarity)
// ============================================

export interface AnnualGoal {
  name: string;
  description: string; // Opis efektu (2-3 zdania)
  definitionOfDone: string; // Obiektywne oznaki ukończenia
}

export interface AnnualPlan {
  // B1. Kierunek na rok
  annualVision: string; // "Do końca roku chcę..." (1 zdanie)
  successSigns: string[]; // 3 oznaki udanego roku
  oneWord: string; // Jedno słowo opisujące rok

  // B2. Cele roczne
  goals: AnnualGoal[]; // 3 cele z Definition of Done
  priorityGoal: number; // Indeks najważniejszego celu (0-2)
  priorityWhy: string; // Dlaczego ten jest najważniejszy

  // B3. Miary roku
  northStar: string; // Jedna główna miara sukcesu
  northStarTarget: string; // Target dla North Star
  supportingMetrics: { name: string; target: string }[]; // 2 miary wspierające

  // B4. Zasady gry
  rules: string[]; // 3 zasady typu "nie biorę X bez Y"
}

// ============================================
// CEL KWARTALNY (Sekcja C z MasterClarity)
// ============================================

export interface Goal {
  name: string;
  why: string;
  actions: string; // Konkretne działania prowadzące do celu
}

export interface Project {
  name: string;
  percentage: number;
}

export interface Milestone {
  month1: string;
  month2: string;
  month3: string;
}

export interface Metric {
  name: string;
  target: string;
}

export interface Risk {
  risk: string;
  mitigation: string;
}

export interface IfThenRule {
  condition: string; // "Jeśli..."
  action: string; // "To zrobię..."
}

export interface QuarterlyPlan {
  // Metadata
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  createdAt?: string;

  // NOWE: Retrospektywa poprzedniego okresu
  retrospective: Retrospective;

  // NOWE: Plan roczny
  annualPlan: AnnualPlan;

  // C1. Wizja i motywacja kwartału
  vision: string; // Jak będzie wyglądało życie gdy osiągniesz
  costOfInaction: string; // NOWE: Cena zaniechania
  braveAction: string; // NOWE: Coś odważnego

  // C2. Cel i miary
  northStar: string; // NOWE: North Star na kwartał
  oneWord: string; // NOWE: Jedno słowo-kierunek

  // C3. Cel kwartalny SMART
  goals: Goal[];
  definitionOfDone: string[]; // NOWE: Checklist ukończenia
  weeklyLeadMeasures: string[]; // NOWE: 2-3 działania co tydzień

  // Projekty i czas
  projects: Project[];
  capacity: number; // NOWE: Godziny tygodniowo na cel

  // Kamienie milowe
  milestones: Milestone;

  // Metryki
  metrics: Metric[];

  // Pre-mortem i ryzyka (ROZBUDOWANE)
  risks: Risk[]; // 3 ryzyka + działania ochronne
  ifThenRules: IfThenRule[]; // NOWE: Reguły If-Then
  stopDoing: string[]; // NOWE: Co odkładasz (3 rzeczy)

  // Kontekst roczny (uproszczony - szczegóły w annualPlan)
  yearContext: string;
}

// ============================================
// DOMYŚLNE WARTOŚCI
// ============================================

export const emptyRetrospective: Retrospective = {
  previousGoals: '',
  delivered: '',
  notDelivered: '',
  keyNumber: '',
  whatWorked: '',
  bestHabits: '',
  recurringProblems: '',
  obstacles: '',
  biggestMistake: '',
  stop: ['', '', ''],
  continue: ['', '', ''],
  start: '',
  openLoops: ['', ''],
};

export const emptyAnnualPlan: AnnualPlan = {
  annualVision: '',
  successSigns: ['', '', ''],
  oneWord: '',
  goals: [
    { name: '', description: '', definitionOfDone: '' },
    { name: '', description: '', definitionOfDone: '' },
    { name: '', description: '', definitionOfDone: '' },
  ],
  priorityGoal: 0,
  priorityWhy: '',
  northStar: '',
  northStarTarget: '',
  supportingMetrics: [
    { name: '', target: '' },
    { name: '', target: '' },
  ],
  rules: ['', '', ''],
};

// Funkcja pomocnicza: oblicz następny kwartał do zaplanowania
function getNextPlannableQuarter(): { quarter: QuarterlyPlan['quarter']; year: number } {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(currentMonth / 3) + 1; // 1-4

  // Następny kwartał
  if (currentQuarter === 4) {
    return { quarter: 'Q1', year: currentYear + 1 };
  }
  return { quarter: `Q${currentQuarter + 1}` as QuarterlyPlan['quarter'], year: currentYear };
}

const nextQuarter = getNextPlannableQuarter();

export const emptyPlan: QuarterlyPlan = {
  quarter: nextQuarter.quarter,
  year: nextQuarter.year,

  // Retrospektywa
  retrospective: emptyRetrospective,

  // Plan roczny
  annualPlan: emptyAnnualPlan,

  // Wizja kwartału
  vision: '',
  costOfInaction: '',
  braveAction: '',

  // Cel i miary
  northStar: '',
  oneWord: '',

  // Cele
  goals: [
    { name: '', why: '', actions: '' },
    { name: '', why: '', actions: '' },
    { name: '', why: '', actions: '' },
  ],
  definitionOfDone: ['', '', ''],
  weeklyLeadMeasures: ['', '', ''],

  // Projekty
  projects: [
    { name: '', percentage: 40 },
    { name: '', percentage: 40 },
    { name: '', percentage: 20 },
  ],
  capacity: 20,

  // Kamienie milowe
  milestones: {
    month1: '',
    month2: '',
    month3: '',
  },

  // Metryki
  metrics: [
    { name: '', target: '' },
    { name: '', target: '' },
  ],

  // Ryzyka i pre-mortem
  risks: [
    { risk: '', mitigation: '' },
    { risk: '', mitigation: '' },
    { risk: '', mitigation: '' },
  ],
  ifThenRules: [
    { condition: '', action: '' },
    { condition: '', action: '' },
  ],
  stopDoing: ['', '', ''],

  // Kontekst
  yearContext: '',
};

// ============================================
// PRZYKŁADOWY PLAN
// ============================================

export const examplePlan: QuarterlyPlan = {
  quarter: 'Q1',
  year: 2026,

  retrospective: {
    previousGoals: 'Launch SaaS, 10 klientów, automatyzacja',
    delivered: '1. MVP uruchomione\n2. 7 płacących klientów\n3. Podstawowa automatyzacja',
    notDelivered: 'Pełna automatyzacja, target 10 klientów',
    keyNumber: '7 płacących klientów',
    whatWorked: 'Codzienne demo calls, focus na 1 produkcie',
    bestHabits: 'Deep work 4h rano, weekly review w niedzielę',
    recurringProblems: 'Rozproszenie na za dużo projektów',
    obstacles: 'Perfekcjonizm, odkładanie launch',
    biggestMistake: 'Zbyt długo budowałem przed pierwszą sprzedażą',
    stop: ['Multitasking', 'Spotkania bez agendy', 'Social media rano'],
    continue: ['Deep work bloki', 'Weekly review', 'Demo przed budowaniem'],
    start: 'Zasada 24h - każdy lead dostaje odpowiedź w ciągu dnia',
    openLoops: ['Rozliczenie z inwestorem', 'Umowa z partnerem'],
  },

  annualPlan: {
    annualVision: 'Do końca 2026 mam 100 płacących klientów i 50k MRR',
    successSigns: [
      'Stabilne 50k MRR',
      'Zespół 3 osoby',
      '4-dniowy tydzień pracy',
    ],
    oneWord: 'WZROST',
    goals: [
      {
        name: '100 płacących klientów',
        description: 'Skalowanie bazy klientów przez content marketing i referrale',
        definitionOfDone: 'Dashboard pokazuje 100+ aktywnych subskrypcji',
      },
      {
        name: 'Zespół 3 osoby',
        description: 'Zatrudnienie dev + support, delegacja operacji',
        definitionOfDone: 'Każda rola obsadzona, onboarding zakończony',
      },
      {
        name: '4-dniowy tydzień pracy',
        description: 'Optymalizacja czasu, focus na high-leverage activities',
        definitionOfDone: 'Piątki wolne przez 2 miesiące z rzędu',
      },
    ],
    priorityGoal: 0,
    priorityWhy: 'Revenue = freedom. Bez klientów nie ma zespołu ani wolności.',
    northStar: 'MRR (Monthly Recurring Revenue)',
    northStarTarget: '50 000 PLN',
    supportingMetrics: [
      { name: 'Liczba aktywnych klientów', target: '100' },
      { name: 'Churn rate', target: '<5%' },
    ],
    rules: [
      'Nie biorę nowego projektu bez zakończenia poprzedniego',
      'Nie zatrudniam bez 3-miesięcznego runway',
      'Nie odpowiadam na maile przed 10:00',
    ],
  },

  vision: 'Budzę się w poniedziałek z energią. Mam 25 nowych klientów, zespół działa samodzielnie.',
  costOfInaction: 'Zostaję na 7 klientach, wypalenie, brak wzrostu, frustracja',
  braveAction: 'Podniosę ceny o 50% dla nowych klientów',

  northStar: '25 nowych klientów',
  oneWord: 'ROZPĘD',

  goals: [
    { name: '+25 płacących klientów', why: 'Fundament pod roczny cel 100 klientów', actions: '5 demo calls tygodniowo, cold outreach 20 firm, content marketing' },
    { name: 'Zatrudnić pierwszą osobę', why: 'Delegacja = skalowalność', actions: 'Job posting, 10 rozmów, onboarding plan' },
    { name: 'System referralowy live', why: 'Organiczny wzrost bez reklam', actions: 'Zaprojektować program, zaimplementować w app, poinformować klientów' },
  ],
  definitionOfDone: [
    '32 aktywne subskrypcje (7+25)',
    'Podpisana umowa z pracownikiem',
    'Min. 5 klientów z referrali',
  ],
  weeklyLeadMeasures: [
    '5 demo calls tygodniowo',
    '2 posty content (LinkedIn/YouTube)',
    '1h na rekrutację',
  ],

  projects: [
    { name: 'Sales & Onboarding', percentage: 50 },
    { name: 'Product Development', percentage: 30 },
    { name: 'Hiring', percentage: 20 },
  ],
  capacity: 35,

  milestones: {
    month1: '+8 klientów, job post live, 3 kandydatów',
    month2: '+8 klientów, osoba zatrudniona, referral system beta',
    month3: '+9 klientów, onboarding zakończony, referral live',
  },

  metrics: [
    { name: 'Nowi klienci', target: '25' },
    { name: 'Demo → Klient conversion', target: '30%' },
  ],

  risks: [
    { risk: 'Brak kandydatów do pracy', mitigation: 'Aktywny outreach na LinkedIn, polecenia' },
    { risk: 'Churn obecnych klientów', mitigation: 'Weekly check-in z top 5 klientami' },
    { risk: 'Wypalenie przy 35h/tydzień', mitigation: 'Blok regeneracji w środy, sport 3x' },
  ],
  ifThenRules: [
    { condition: 'Czuję się przytłoczony', action: 'Zamykam laptop, 20min spacer, 1 zadanie' },
    { condition: 'Klient prosi o custom feature', action: 'Mówię: sprawdzę czy pasuje do roadmapy' },
  ],
  stopDoing: ['Darmowe konsultacje', 'Niestandardowe integracje', 'Weekendowa praca'],

  yearContext: 'Q1 to fundament pod scale. Focus na powtarzalny proces sprzedaży i pierwszy hire.',
};

// ============================================
// HELPERY
// ============================================

export const getQuarterMonths = (quarter: QuarterlyPlan['quarter']): string[] => {
  const months = {
    Q1: ['Styczeń', 'Luty', 'Marzec'],
    Q2: ['Kwiecień', 'Maj', 'Czerwiec'],
    Q3: ['Lipiec', 'Sierpień', 'Wrzesień'],
    Q4: ['Październik', 'Listopad', 'Grudzień'],
  };
  return months[quarter];
};

export const getPreviousQuarter = (quarter: QuarterlyPlan['quarter'], year: number): { quarter: QuarterlyPlan['quarter']; year: number } => {
  const quarters: QuarterlyPlan['quarter'][] = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentIndex = quarters.indexOf(quarter);

  if (currentIndex === 0) {
    return { quarter: 'Q4', year: year - 1 };
  }
  return { quarter: quarters[currentIndex - 1], year };
};
