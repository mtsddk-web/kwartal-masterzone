import {
  QuarterlyPlan,
  emptyPlan,
  emptyRetrospective,
  emptyAnnualPlan
} from '@/types/plan';

/**
 * Parse Markdown exported from Kwartal app back to QuarterlyPlan
 * This is a best-effort parser - it extracts what it can find
 */
export function parseMarkdownToPlan(markdown: string): Partial<QuarterlyPlan> {
  const plan: Partial<QuarterlyPlan> = {};

  // Helper to extract section content
  const getSection = (header: string): string => {
    const regex = new RegExp(`## ${header}\\n\\n([\\s\\S]*?)(?=\\n## |\\n# |\\n---|\$)`, 'i');
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  };

  const getH1Section = (header: string): string => {
    const regex = new RegExp(`# ${header}\\n\\n([\\s\\S]*?)(?=\\n# |\\n---|\$)`, 'i');
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  };

  // Extract quarter and year from title
  const titleMatch = markdown.match(/# Plan (Q[1-4]) (\d{4})/);
  if (titleMatch) {
    plan.quarter = titleMatch[1] as QuarterlyPlan['quarter'];
    plan.year = parseInt(titleMatch[2]);
  }

  // === RETROSPECTIVE ===
  const retroSection = getH1Section('Retrospektywa poprzedniego okresu');
  if (retroSection) {
    plan.retrospective = {
      ...emptyRetrospective,
      previousGoals: getSection('Cele z poprzedniego okresu'),
      delivered: getSection('Co dowieziono'),
      notDelivered: getSection('Czego nie dowieziono'),
      keyNumber: getSection('Kluczowa liczba okresu').replace(/\*\*/g, ''),
      whatWorked: getSection('Co działało'),
      bestHabits: getSection('Najlepsze nawyki'),
      biggestMistake: getSection('Największa lekcja'),
    };

    // Parse STOP/CONTINUE/START
    const decisionsSection = getSection('Decyzje zamykające');
    if (decisionsSection) {
      const stopMatch = decisionsSection.match(/\*\*STOP:\*\*\n([\s\S]*?)(?=\*\*CONTINUE|\*\*START|$)/);
      if (stopMatch) {
        plan.retrospective.stop = stopMatch[1]
          .split('\n')
          .filter(l => l.startsWith('- '))
          .map(l => l.replace(/^- ~~(.*)~~$/, '$1').trim())
          .slice(0, 3);
        while (plan.retrospective.stop.length < 3) plan.retrospective.stop.push('');
      }

      const continueMatch = decisionsSection.match(/\*\*CONTINUE:\*\*\n([\s\S]*?)(?=\*\*START|$)/);
      if (continueMatch) {
        plan.retrospective.continue = continueMatch[1]
          .split('\n')
          .filter(l => l.startsWith('- '))
          .map(l => l.replace(/^- /, '').trim())
          .slice(0, 3);
        while (plan.retrospective.continue.length < 3) plan.retrospective.continue.push('');
      }

      const startMatch = decisionsSection.match(/\*\*START:\*\*\n\n- (.+)/);
      if (startMatch) {
        plan.retrospective.start = startMatch[1].trim();
      }
    }

    // Open loops
    const openLoopsSection = getSection('Otwarte pętle do domknięcia');
    if (openLoopsSection) {
      plan.retrospective.openLoops = openLoopsSection
        .split('\n')
        .filter(l => l.startsWith('- [ ]'))
        .map(l => l.replace(/^- \[ \] /, '').trim())
        .slice(0, 2);
      while (plan.retrospective.openLoops.length < 2) plan.retrospective.openLoops.push('');
    }
  }

  // === ANNUAL PLAN ===
  const annualSection = markdown.match(/# Plan Roczny \d{4}/);
  if (annualSection) {
    plan.annualPlan = {
      ...emptyAnnualPlan,
      annualVision: getSection('Wizja roczna').replace(/^\*"|"\*$/g, ''),
      oneWord: getSection('Słowo roku').replace(/\*\*/g, ''),
    };

    // Success signs
    const signsSection = getSection('Oznaki udanego roku');
    if (signsSection) {
      plan.annualPlan.successSigns = signsSection
        .split('\n')
        .filter(l => l.startsWith('- '))
        .map(l => l.replace(/^- /, '').trim())
        .slice(0, 3);
      while (plan.annualPlan.successSigns.length < 3) plan.annualPlan.successSigns.push('');
    }

    // North Star
    const northStarSection = getSection('North Star Roczny');
    if (northStarSection) {
      const nsMatch = northStarSection.match(/\*\*(.+?):\*\* (.+)/);
      if (nsMatch) {
        plan.annualPlan.northStar = nsMatch[1];
        plan.annualPlan.northStarTarget = nsMatch[2];
      }
    }

    // Annual goals
    const goalsMatch = markdown.match(/## Cele roczne\n\n([\s\S]*?)(?=\n## |$)/);
    if (goalsMatch) {
      const goalsText = goalsMatch[1];
      const goalMatches = Array.from(goalsText.matchAll(/### \d+\. (.+?)(?:\n(.+?))?(?:\n\*Definition of Done:\* (.+?))?(?=\n### |\n## |$)/g));

      plan.annualPlan.goals = [];
      for (const match of goalMatches) {
        plan.annualPlan.goals.push({
          name: match[1].replace(/ ⭐$/, '').trim(),
          description: match[2]?.trim() || '',
          definitionOfDone: match[3]?.trim() || '',
        });
      }
      while (plan.annualPlan.goals.length < 3) {
        plan.annualPlan.goals.push({ name: '', description: '', definitionOfDone: '' });
      }
    }

    // Rules
    const rulesSection = getSection('Zasady gry na rok');
    if (rulesSection) {
      plan.annualPlan.rules = rulesSection
        .split('\n')
        .filter(l => l.startsWith('- '))
        .map(l => l.replace(/^- /, '').trim())
        .slice(0, 3);
      while (plan.annualPlan.rules.length < 3) plan.annualPlan.rules.push('');
    }
  }

  // === QUARTERLY PLAN ===

  // One word
  const oneWordMatch = markdown.match(/## Słowo-kompas: \*\*(.+?)\*\*/);
  if (oneWordMatch) {
    plan.oneWord = oneWordMatch[1];
  }

  // North Star
  const nsMatch = markdown.match(/## North Star: (.+)/);
  if (nsMatch) {
    plan.northStar = nsMatch[1];
  }

  // Vision
  const visionSection = getSection('Wizja Kwartału');
  if (visionSection && visionSection !== '*Brak wizji*') {
    plan.vision = visionSection;
  }

  // Goals
  const top3Section = markdown.match(/## TOP 3 Cele\n\n([\s\S]*?)(?=\n---)/);
  if (top3Section) {
    const goalsText = top3Section[1];
    const goalMatches = Array.from(goalsText.matchAll(/### \d+\. (.+?)\n(?:\*Dlaczego:\* (.+?)\n)?(?:\*Działania:\* (.+?))?(?=\n### |\n|$)/g));

    plan.goals = [];
    for (const match of goalMatches) {
      plan.goals.push({
        name: match[1].trim(),
        why: match[2]?.trim() || '',
      });
    }
    while (plan.goals.length < 3) {
      plan.goals.push({ name: '', why: '' });
    }
  }

  // Projects
  const projectsSection = getSection('Projekty');
  if (projectsSection) {
    const projectMatches = Array.from(projectsSection.matchAll(/- \*\*(.+?)\*\* - (\d+)% czasu/g));
    plan.projects = [];
    for (const match of projectMatches) {
      plan.projects.push({
        name: match[1],
        percentage: parseInt(match[2]),
      });
    }
    while (plan.projects.length < 3) {
      plan.projects.push({ name: '', percentage: plan.projects.length === 0 ? 40 : 20 });
    }
  }

  // Milestones
  const milestonesSection = getSection('Kamienie Milowe');
  if (milestonesSection) {
    plan.milestones = { month1: '', month2: '', month3: '' };
    const monthMatches = Array.from(milestonesSection.matchAll(/### (.+?)\n(.+?)(?=\n### |\n## |$)/g));
    let i = 0;
    for (const match of monthMatches) {
      if (i === 0) plan.milestones.month1 = match[2].trim();
      if (i === 1) plan.milestones.month2 = match[2].trim();
      if (i === 2) plan.milestones.month3 = match[2].trim();
      i++;
    }
  }

  // Metrics
  const metricsSection = getSection('Metryki Sukcesu');
  if (metricsSection) {
    const metricMatches = Array.from(metricsSection.matchAll(/- \*\*(.+?):\*\* (.+)/g));
    plan.metrics = [];
    for (const match of metricMatches) {
      plan.metrics.push({
        name: match[1],
        target: match[2],
      });
    }
    while (plan.metrics.length < 2) {
      plan.metrics.push({ name: '', target: '' });
    }
  }

  // Risks
  const risksSection = markdown.match(/## Ryzyka i Zabezpieczenia\n\n([\s\S]*?)(?=\n---)/);
  if (risksSection) {
    const risksText = risksSection[1];
    const riskMatches = Array.from(risksText.matchAll(/### Ryzyko \d+\n⚠️ (.+?)\n(?:✅ Mitygacja: (.+?))?(?=\n### |\n## |$)/g));
    plan.risks = [];
    for (const match of riskMatches) {
      plan.risks.push({
        risk: match[1].trim(),
        mitigation: match[2]?.trim() || '',
      });
    }
    while (plan.risks.length < 3) {
      plan.risks.push({ risk: '', mitigation: '' });
    }
  }

  // If-Then Rules
  const ifThenSection = getSection('Reguły If-Then');
  if (ifThenSection) {
    const ruleMatches = Array.from(ifThenSection.matchAll(/- \*\*Jeśli\*\* (.+?) \*\*→ To\*\* (.+)/g));
    plan.ifThenRules = [];
    for (const match of ruleMatches) {
      plan.ifThenRules.push({
        condition: match[1],
        action: match[2],
      });
    }
    while (plan.ifThenRules.length < 2) {
      plan.ifThenRules.push({ condition: '', action: '' });
    }
  }

  // Stop Doing
  const stopDoingSection = getSection('Stop Doing \\(co odkładam\\)');
  if (stopDoingSection) {
    plan.stopDoing = stopDoingSection
      .split('\n')
      .filter(l => l.startsWith('- '))
      .map(l => l.replace(/^- ~~(.*)~~$/, '$1').trim())
      .slice(0, 3);
    while (plan.stopDoing.length < 3) plan.stopDoing.push('');
  }

  // Capacity
  const capacityMatch = markdown.match(/## Capacity\n\n\*\*(\d+) godzin/);
  if (capacityMatch) {
    plan.capacity = parseInt(capacityMatch[1]);
  }

  // Year Context
  const contextSection = getSection('Kontekst Roczny');
  if (contextSection) {
    plan.yearContext = contextSection;
  }

  return plan;
}

/**
 * Merge parsed plan with empty plan to ensure all fields exist
 */
export function mergeParsedPlan(parsed: Partial<QuarterlyPlan>): QuarterlyPlan {
  return {
    ...emptyPlan,
    ...parsed,
    retrospective: {
      ...emptyRetrospective,
      ...parsed.retrospective,
    },
    annualPlan: {
      ...emptyAnnualPlan,
      ...parsed.annualPlan,
    },
  };
}

/**
 * Read file and parse markdown
 */
export async function importMarkdownFile(file: File): Promise<QuarterlyPlan> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseMarkdownToPlan(content);
        const plan = mergeParsedPlan(parsed);
        resolve(plan);
      } catch (error) {
        reject(new Error('Nie udało się sparsować pliku Markdown'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać pliku'));
    };

    reader.readAsText(file);
  });
}
