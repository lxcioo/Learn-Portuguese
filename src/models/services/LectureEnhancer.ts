import { Exercise, MatchingPair } from '@/src/models/types';
import { getLessonTip } from '@/src/models/data/lessonTips';

export interface DialogueScenario {
  unitPrefix: string;
  speaker: string;
  context: string;
  dialoguePrompt: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

const UNIT_DIALOGUES: Record<string, DialogueScenario> = {
  u1: {
    unitPrefix: 'u1',
    speaker: 'João (Lissabon)',
    context: 'Zufällige Begegnung am Aussichtspunkt',
    dialoguePrompt: 'Olá! Bom dia, tudo bem?',
    question: 'Wie antwortest du freundlich auf Portugiesisch?',
    correctAnswer: 'Tudo bem, obrigado! E contigo?',
    options: [
      'Tudo bem, obrigado! E contigo?',
      'Uma bica, faz favor!',
      'Adeus e até para a semana.',
    ],
  },
  u2: {
    unitPrefix: 'u2',
    speaker: 'Mariana',
    context: 'Vorstellung in einem Café',
    dialoguePrompt: 'Muito prazer! Como te chamas?',
    question: 'Wie stellst du dich auf Portugiesisch vor?',
    correctAnswer: 'Muito prazer! Chamo-me Lucas.',
    options: [
      'Muito prazer! Chamo-me Lucas.',
      'Não faz mal nenhum.',
      'Onde fica a casa de banho?',
    ],
  },
  u3: {
    unitPrefix: 'u3',
    speaker: 'Garçom no Café',
    context: 'Bestellung in einer Pastelaria',
    dialoguePrompt: 'Boa tarde! O que vai desejar tomar?',
    question: 'Bestelle typisch portugiesisch:',
    correctAnswer: 'Uma bica e um pastel de nata, por favor.',
    options: [
      'Uma bica e um pastel de nata, por favor.',
      'Eu tenho trinta anos.',
      'O tempo hoje está muito nublado.',
    ],
  },
  u4: {
    unitPrefix: 'u4',
    speaker: 'Passant in Porto',
    context: 'Auf der Suche nach der Metro',
    dialoguePrompt: 'Com licença, posso ajudar?',
    question: 'Frage nach dem Weg zur Metrostation:',
    correctAnswer: 'Onde fica a estação de metro mais próxima?',
    options: [
      'Onde fica a estação de metro mais próxima?',
      'Gostaria de uma sopa de legumes.',
      'Eu sou professor de línguas.',
    ],
  },
  u5: {
    unitPrefix: 'u5',
    speaker: 'Ana',
    context: 'Gespräch über die Familie',
    dialoguePrompt: 'Tens irmãos ou irmãs na tua família?',
    question: 'Antworte, dass du einen Bruder hast:',
    correctAnswer: 'Sim, tenho um irmão mais velho.',
    options: [
      'Sim, tenho um irmão mais velho.',
      'A conta, se faz favor.',
      'Siga sempre em frente e vire à direita.',
    ],
  },
};

export class LectureEnhancer {
  /**
   * Enhances raw exercises for a lesson into a varied, multi-modal pedagogical journey.
   * Includes:
   * 1. 3D Card Mode (Flashcards) for introduction
   * 2. Pure Listening comprehension (audio only)
   * 3. Satzbau-Puzzle (Sentence Scramble with word tokens)
   * 4. Interactive Pair Matching (Wortpaare verbinden)
   * 5. Situational Dialogues
   * 6. Active Translation (Word bank & Typing)
   */
  static enhanceLesson(
    rawExercises: Exercise[],
    lessonId: string,
    lessonTitle?: string
  ): Exercise[] {
    if (!rawExercises || rawExercises.length === 0) return [];

    // Extract all vocabulary items and Portuguese-German pairs
    const pairs: { pt: string; de: string; vocabObj?: Exercise['vocabulary'] }[] = [];

    rawExercises.forEach((ex) => {
      let pt = '';
      let de = '';

      if (ex.type === 'translate_to_pt') {
        de = ex.question;
        pt = ex.correctAnswer;
      } else if (ex.type === 'translate_to_de') {
        pt = ex.question;
        de = ex.correctAnswer;
      } else {
        pt = ex.correctAnswer;
        de = ex.question;
      }

      if (pt && de && !pairs.some((p) => p.pt.toLowerCase() === pt.toLowerCase())) {
        pairs.push({ pt, de, vocabObj: ex.vocabulary });
      }
    });

    const enhancedQueue: Exercise[] = [];
    const lessonTip = getLessonTip(lessonId);

    // ==========================================
    // 1. CARD MODE: Introduce 1-2 key phrases as 3D Flashcards
    // ==========================================
    if (pairs.length > 0) {
      const cardPair = pairs[0];
      enhancedQueue.push({
        id: `${lessonId}_card_1`,
        type: 'card',
        question: cardPair.pt,
        correctAnswer: cardPair.de,
        cardFront: cardPair.pt,
        cardBack: cardPair.de,
        cardNotes: lessonTip.culturalNote || lessonTip.tip,
        pronunciation: lessonTip.pronunciationTip,
        audioText: cardPair.pt,
        vocabulary: cardPair.vocabObj,
      });

      if (pairs.length >= 4) {
        const secondCardPair = pairs[1];
        enhancedQueue.push({
          id: `${lessonId}_card_2`,
          type: 'card',
          question: secondCardPair.pt,
          correctAnswer: secondCardPair.de,
          cardFront: secondCardPair.pt,
          cardBack: secondCardPair.de,
          audioText: secondCardPair.pt,
          vocabulary: secondCardPair.vocabObj,
        });
      }
    }

    // ==========================================
    // 2. LISTENING MODE: Pure audio ear-training without text prompt
    // ==========================================
    const listenPair = pairs.length > 2 ? pairs[2] : pairs[0];
    if (listenPair) {
      // Build 4 multiple choice options for listening
      const wrongOptions = pairs
        .filter((p) => p.de !== listenPair.de)
        .map((p) => p.de)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allOptions = [listenPair.de, ...wrongOptions].sort(() => Math.random() - 0.5);

      enhancedQueue.push({
        id: `${lessonId}_listen_choice`,
        type: 'listen_choice',
        question: 'Höre genau zu und wähle die richtige deutsche Bedeutung:',
        correctAnswer: listenPair.de,
        audioText: listenPair.pt,
        options: allOptions,
        correctAnswerIndex: allOptions.indexOf(listenPair.de),
        vocabulary: listenPair.vocabObj,
      });
    }

    // ==========================================
    // 3. SATZBAU-PUZZLE: Scramble Sentence Builder
    // ==========================================
    // Find an exercise with at least 2 words
    const multiWordExercise =
      rawExercises.find((ex) => {
        const words = ex.correctAnswer.trim().split(/\s+/);
        return words.length >= 2;
      }) || rawExercises[0];

    if (multiWordExercise) {
      enhancedQueue.push({
        id: `${lessonId}_scramble_puzzle`,
        type: 'scramble',
        question:
          multiWordExercise.type === 'translate_to_pt'
            ? `Bringe die Wörter in die richtige portugiesische Reihenfolge für: "${multiWordExercise.question}"`
            : `Bringe die portugiesischen Satzbausteine in die richtige Reihenfolge:`,
        correctAnswer: multiWordExercise.correctAnswer,
        alternativeAnswers: multiWordExercise.alternativeAnswers,
        audioText: multiWordExercise.correctAnswer,
        vocabulary: multiWordExercise.vocabulary,
      });
    }

    // ==========================================
    // 4. WORTPAARE VERBINDEN: Match 4 Portuguese & German pairs
    // ==========================================
    if (pairs.length >= 3) {
      const matchSubset = pairs.slice(0, 4);
      const matchingPairs: MatchingPair[] = matchSubset.map((p, idx) => ({
        id: `pair_${idx}`,
        pt: p.pt,
        de: p.de,
      }));

      enhancedQueue.push({
        id: `${lessonId}_match_pairs`,
        type: 'match_pairs',
        question: 'Verbinde die passenden portugiesischen und deutschen Wortpaare:',
        correctAnswer: 'All pairs matched',
        matchingPairs,
      });
    }

    // ==========================================
    // 5. SITUATIONAL DIALOGUE: Contextual Conversation
    // ==========================================
    const unitKey = Object.keys(UNIT_DIALOGUES).find((k) => lessonId.startsWith(k));
    if (unitKey && UNIT_DIALOGUES[unitKey]) {
      const scenario = UNIT_DIALOGUES[unitKey];
      enhancedQueue.push({
        id: `${lessonId}_dialogue`,
        type: 'dialogue',
        question: scenario.question,
        correctAnswer: scenario.correctAnswer,
        audioText: scenario.dialoguePrompt,
        dialogueSpeaker: scenario.speaker,
        dialogueContext: scenario.context,
        dialoguePrompt: scenario.dialoguePrompt,
        options: scenario.options,
        correctAnswerIndex: scenario.options.indexOf(scenario.correctAnswer),
      });
    } else if (pairs.length >= 2) {
      // Fallback situational dialogue from lesson content
      const chosenPair = pairs[1];
      const otherPair = pairs[0];
      enhancedQueue.push({
        id: `${lessonId}_dialogue`,
        type: 'dialogue',
        question: `Jemand sagt zu dir: "${chosenPair.pt}". Was ist eine passende Antwort?`,
        correctAnswer: otherPair.pt,
        audioText: chosenPair.pt,
        dialogueSpeaker: 'Einheimischer in Portugal',
        dialogueContext: lessonTitle || 'Alltägliches Gespräch',
        dialoguePrompt: chosenPair.pt,
        options: [otherPair.pt, 'Não, obrigado.', 'Por favor?'].sort(() => Math.random() - 0.5),
        correctAnswerIndex: 0,
      });
    }

    // ==========================================
    // 6. ACTIVE RECALL / TRANSLATION: 2 high-value questions with word-bank / typing
    // ==========================================
    const remainingExercises = rawExercises
      .filter((ex) => ex.id !== multiWordExercise?.id)
      .slice(0, 2);

    remainingExercises.forEach((ex, idx) => {
      enhancedQueue.push({
        ...ex,
        id: `${lessonId}_active_recall_${idx}`,
      });
    });

    return enhancedQueue;
  }
}
