import { MathExpression, CHEMISTRY_ELEMENTS } from '@/types/game';

// Level 1-5: Positive integers (1-9)
function generateLevel1to5(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
    { display: `${value - 1} + 1`, value, difficulty: 2 },
    { display: `${value + 1} - 1`, value, difficulty: 2 },
    { display: `${value * 2} ÷ 2`, value, difficulty: 3 },
    { display: `${value} × 1`, value, difficulty: 2 },
  ];
  if (value > 1) {
    expressions.push({ display: `${value * 2} - ${value}`, value, difficulty: 3 });
  }
  if (value === 4) {
    expressions.push({ display: `2 × 2`, value, difficulty: 2 });
    expressions.push({ display: `2²`, value, difficulty: 3 });
  }
  if (value === 2) {
    expressions.push({ display: `4 ÷ 2`, value, difficulty: 2 });
  }
  if (value === 1) {
    expressions.push({ display: `3 - 2`, value, difficulty: 2 });
    expressions.push({ display: `1²`, value, difficulty: 3 });
  }
  if (value === 3) {
    expressions.push({ display: `9 ÷ 3`, value, difficulty: 3 });
    expressions.push({ display: `1 + 2`, value, difficulty: 2 });
  }
  if (value === 5) {
    expressions.push({ display: `10 ÷ 2`, value, difficulty: 2 });
    expressions.push({ display: `2 + 3`, value, difficulty: 2 });
  }
  if (value === 6) {
    expressions.push({ display: `3 × 2`, value, difficulty: 2 });
    expressions.push({ display: `12 ÷ 2`, value, difficulty: 2 });
  }
  if (value === 7) {
    expressions.push({ display: `14 ÷ 2`, value, difficulty: 2 });
    expressions.push({ display: `3 + 4`, value, difficulty: 2 });
  }
  if (value === 8) {
    expressions.push({ display: `4 × 2`, value, difficulty: 2 });
    expressions.push({ display: `16 ÷ 2`, value, difficulty: 2 });
  }
  if (value === 9) {
    expressions.push({ display: `3 × 3`, value, difficulty: 2 });
    expressions.push({ display: `3²`, value, difficulty: 3 });
    expressions.push({ display: `18 ÷ 2`, value, difficulty: 2 });
  }
  return expressions;
}

// Level 6-10: Negative integers mixed with positive (1-9 with some negative expressions)
function generateLevel6to10(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
    { display: `${value + 3} - 3`, value, difficulty: 2 },
    { display: `${value - 2} + 2`, value, difficulty: 2 },
  ];
  if (value <= 5) {
    expressions.push({ display: `${value + 5} - 5`, value, difficulty: 3 });
  }
  if (value >= 2) {
    expressions.push({ display: `(-1) × (-${value})`, value, difficulty: 4 });
  }
  if (value === 1) {
    expressions.push({ display: `(-1) × (-1)`, value, difficulty: 4 });
    expressions.push({ display: `5 - 4`, value, difficulty: 2 });
  }
  if (value === 2) {
    expressions.push({ display: `(-2) × (-1)`, value, difficulty: 4 });
    expressions.push({ display: `8 - 6`, value, difficulty: 2 });
  }
  if (value === 3) {
    expressions.push({ display: `(-3) × (-1)`, value, difficulty: 4 });
    expressions.push({ display: `6 - 3`, value, difficulty: 2 });
  }
  if (value === 4) {
    expressions.push({ display: `(-2) × (-2)`, value, difficulty: 4 });
    expressions.push({ display: `8 - 4`, value, difficulty: 2 });
  }
  if (value === 5) {
    expressions.push({ display: `10 - 5`, value, difficulty: 2 });
    expressions.push({ display: `(-5) × (-1)`, value, difficulty: 4 });
  }
  if (value === 6) {
    expressions.push({ display: `(-2) × (-3)`, value, difficulty: 4 });
    expressions.push({ display: `9 - 3`, value, difficulty: 2 });
  }
  if (value === 7) {
    expressions.push({ display: `10 - 3`, value, difficulty: 2 });
  }
  if (value === 8) {
    expressions.push({ display: `(-2) × (-4)`, value, difficulty: 4 });
    expressions.push({ display: `12 - 4`, value, difficulty: 2 });
  }
  if (value === 9) {
    expressions.push({ display: `(-3) × (-3)`, value, difficulty: 4 });
    expressions.push({ display: `15 - 6`, value, difficulty: 2 });
  }
  return expressions;
}

// Level 11-15: Basic fractions
function generateLevel11to15(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
  ];
  
  if (value === 1) {
    expressions.push({ display: `½ + ½`, value, difficulty: 3 });
    expressions.push({ display: `¼ + ¾`, value, difficulty: 4 });
    expressions.push({ display: `⅓ + ⅔`, value, difficulty: 4 });
    expressions.push({ display: `2 × ½`, value, difficulty: 3 });
  }
  if (value === 2) {
    expressions.push({ display: `½ + 1½`, value, difficulty: 4 });
    expressions.push({ display: `4 × ½`, value, difficulty: 3 });
    expressions.push({ display: `1 + ½ + ½`, value, difficulty: 4 });
  }
  if (value === 3) {
    expressions.push({ display: `6 × ½`, value, difficulty: 3 });
    expressions.push({ display: `2 + ½ + ½`, value, difficulty: 4 });
    expressions.push({ display: `9 × ⅓`, value, difficulty: 4 });
  }
  if (value === 4) {
    expressions.push({ display: `8 × ½`, value, difficulty: 3 });
    expressions.push({ display: `3 + ¾ + ¼`, value, difficulty: 5 });
    expressions.push({ display: `12 × ⅓`, value, difficulty: 4 });
  }
  if (value === 5) {
    expressions.push({ display: `10 × ½`, value, difficulty: 3 });
    expressions.push({ display: `15 × ⅓`, value, difficulty: 4 });
    expressions.push({ display: `4 + ½ + ½`, value, difficulty: 4 });
  }
  if (value === 6) {
    expressions.push({ display: `12 × ½`, value, difficulty: 3 });
    expressions.push({ display: `18 × ⅓`, value, difficulty: 4 });
    expressions.push({ display: `5 + ½ + ½`, value, difficulty: 4 });
  }
  if (value === 7) {
    expressions.push({ display: `14 × ½`, value, difficulty: 3 });
    expressions.push({ display: `21 × ⅓`, value, difficulty: 4 });
  }
  if (value === 8) {
    expressions.push({ display: `16 × ½`, value, difficulty: 3 });
    expressions.push({ display: `24 × ⅓`, value, difficulty: 4 });
  }
  if (value === 9) {
    expressions.push({ display: `18 × ½`, value, difficulty: 3 });
    expressions.push({ display: `27 × ⅓`, value, difficulty: 4 });
  }
  return expressions;
}

// Level 16-20: Decimals and percentages
function generateLevel16to20(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
    { display: `${value}.0`, value, difficulty: 2 },
  ];
  
  if (value === 1) {
    expressions.push({ display: `0.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `100%`, value, difficulty: 3 });
    expressions.push({ display: `50% + 50%`, value, difficulty: 4 });
    expressions.push({ display: `0.25 × 4`, value, difficulty: 4 });
  }
  if (value === 2) {
    expressions.push({ display: `1.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `200%`, value, difficulty: 3 });
    expressions.push({ display: `0.5 × 4`, value, difficulty: 4 });
  }
  if (value === 3) {
    expressions.push({ display: `2.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `1.5 × 2`, value, difficulty: 4 });
    expressions.push({ display: `300%`, value, difficulty: 3 });
  }
  if (value === 4) {
    expressions.push({ display: `3.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `2.0 × 2`, value, difficulty: 3 });
    expressions.push({ display: `400%`, value, difficulty: 3 });
    expressions.push({ display: `0.25 × 16`, value, difficulty: 5 });
  }
  if (value === 5) {
    expressions.push({ display: `4.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `2.5 × 2`, value, difficulty: 4 });
    expressions.push({ display: `500%`, value, difficulty: 3 });
  }
  if (value === 6) {
    expressions.push({ display: `5.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `3.0 × 2`, value, difficulty: 3 });
    expressions.push({ display: `600%`, value, difficulty: 3 });
  }
  if (value === 7) {
    expressions.push({ display: `6.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `3.5 × 2`, value, difficulty: 4 });
    expressions.push({ display: `700%`, value, difficulty: 3 });
  }
  if (value === 8) {
    expressions.push({ display: `7.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `4.0 × 2`, value, difficulty: 3 });
    expressions.push({ display: `800%`, value, difficulty: 3 });
  }
  if (value === 9) {
    expressions.push({ display: `8.5 + 0.5`, value, difficulty: 3 });
    expressions.push({ display: `4.5 × 2`, value, difficulty: 4 });
    expressions.push({ display: `900%`, value, difficulty: 3 });
  }
  return expressions;
}

// Level 21-25: Square roots and powers
function generateLevel21to25(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
  ];
  
  if (value === 1) {
    expressions.push({ display: `√1`, value, difficulty: 3 });
    expressions.push({ display: `1⁰`, value, difficulty: 4 });
    expressions.push({ display: `2⁰`, value, difficulty: 4 });
    expressions.push({ display: `1¹`, value, difficulty: 3 });
  }
  if (value === 2) {
    expressions.push({ display: `√4`, value, difficulty: 3 });
    expressions.push({ display: `2¹`, value, difficulty: 3 });
    expressions.push({ display: `8 ÷ 2²`, value, difficulty: 5 });
  }
  if (value === 3) {
    expressions.push({ display: `√9`, value, difficulty: 3 });
    expressions.push({ display: `3¹`, value, difficulty: 3 });
    expressions.push({ display: `27 ÷ 3²`, value, difficulty: 5 });
  }
  if (value === 4) {
    expressions.push({ display: `√16`, value, difficulty: 3 });
    expressions.push({ display: `2²`, value, difficulty: 3 });
    expressions.push({ display: `4¹`, value, difficulty: 3 });
    expressions.push({ display: `√4 × √4`, value, difficulty: 5 });
  }
  if (value === 5) {
    expressions.push({ display: `√25`, value, difficulty: 3 });
    expressions.push({ display: `5¹`, value, difficulty: 3 });
  }
  if (value === 6) {
    expressions.push({ display: `√36`, value, difficulty: 3 });
    expressions.push({ display: `2 × 3`, value, difficulty: 2 });
    expressions.push({ display: `√4 × √9`, value, difficulty: 5 });
  }
  if (value === 7) {
    expressions.push({ display: `√49`, value, difficulty: 3 });
    expressions.push({ display: `7¹`, value, difficulty: 3 });
  }
  if (value === 8) {
    expressions.push({ display: `√64`, value, difficulty: 3 });
    expressions.push({ display: `2³`, value, difficulty: 3 });
    expressions.push({ display: `√4 × √16`, value, difficulty: 5 });
  }
  if (value === 9) {
    expressions.push({ display: `√81`, value, difficulty: 3 });
    expressions.push({ display: `3²`, value, difficulty: 3 });
    expressions.push({ display: `√9 × √9`, value, difficulty: 5 });
  }
  return expressions;
}

// Level 26-30: Complex combinations
function generateLevel26to30(value: number): MathExpression[] {
  const expressions: MathExpression[] = [
    { display: `${value}`, value, difficulty: 1 },
  ];
  
  if (value === 1) {
    expressions.push({ display: `√1 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `(½)² × 4`, value, difficulty: 6 });
    expressions.push({ display: `|-1|`, value, difficulty: 4 });
    expressions.push({ display: `2² - 3`, value, difficulty: 4 });
  }
  if (value === 2) {
    expressions.push({ display: `√4 × 50%`, value, difficulty: 5 });
    expressions.push({ display: `|-2|`, value, difficulty: 4 });
    expressions.push({ display: `3² - 7`, value, difficulty: 5 });
    expressions.push({ display: `½ × √16`, value, difficulty: 5 });
  }
  if (value === 3) {
    expressions.push({ display: `√9 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-3|`, value, difficulty: 4 });
    expressions.push({ display: `2² - 1`, value, difficulty: 4 });
    expressions.push({ display: `¾ × 4`, value, difficulty: 5 });
  }
  if (value === 4) {
    expressions.push({ display: `√16 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-4|`, value, difficulty: 4 });
    expressions.push({ display: `2³ ÷ 2`, value, difficulty: 5 });
    expressions.push({ display: `(√4)²`, value, difficulty: 5 });
    expressions.push({ display: `⅔ × 6`, value, difficulty: 5 });
  }
  if (value === 5) {
    expressions.push({ display: `√25 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-5|`, value, difficulty: 4 });
    expressions.push({ display: `3² - 4`, value, difficulty: 4 });
  }
  if (value === 6) {
    expressions.push({ display: `√36 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-6|`, value, difficulty: 4 });
    expressions.push({ display: `2³ - 2`, value, difficulty: 5 });
  }
  if (value === 7) {
    expressions.push({ display: `√49 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-7|`, value, difficulty: 4 });
    expressions.push({ display: `3² - 2`, value, difficulty: 4 });
  }
  if (value === 8) {
    expressions.push({ display: `√64 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-8|`, value, difficulty: 4 });
    expressions.push({ display: `2³`, value, difficulty: 3 });
  }
  if (value === 9) {
    expressions.push({ display: `√81 × 100%`, value, difficulty: 5 });
    expressions.push({ display: `|-9|`, value, difficulty: 4 });
    expressions.push({ display: `3²`, value, difficulty: 3 });
  }
  return expressions;
}

export function generateExpression(value: number, level: number): MathExpression {
  let expressions: MathExpression[];
  
  if (level <= 5) {
    expressions = generateLevel1to5(value);
  } else if (level <= 10) {
    expressions = generateLevel6to10(value);
  } else if (level <= 15) {
    expressions = generateLevel11to15(value);
  } else if (level <= 20) {
    expressions = generateLevel16to20(value);
  } else if (level <= 25) {
    expressions = generateLevel21to25(value);
  } else {
    expressions = generateLevel26to30(value);
  }
  
  // Filter expressions based on level difficulty
  const maxDifficulty = Math.ceil(level / 5) + 2;
  const filtered = expressions.filter(e => e.difficulty <= maxDifficulty);
  
  // Random selection weighted towards harder expressions at higher levels
  const finalList = filtered.length > 0 ? filtered : expressions;
  return finalList[Math.floor(Math.random() * finalList.length)];
}

export function getValueRange(_level: number): { min: number; max: number; size: number } {
  // 9x9 Sudoku always uses 1-9
  return { min: 1, max: 9, size: 9 };
}

export function generateChemistryExpression(value: number, level: number): MathExpression {
  const element = CHEMISTRY_ELEMENTS[value];
  const expressions: MathExpression[] = [
    { display: element.symbol, value, difficulty: 1 },
    { display: `Z=${element.atomicNumber}`, value, difficulty: 2 },
    { display: `Grupo ${element.group}`, value, difficulty: 2 },
    { display: `Período ${element.period}`, value, difficulty: 3 },
  ];
  
  if (level > 10) {
    expressions.push(
      { display: `${element.name[0]}ᵤ${value}`, value, difficulty: 4 },
      { display: `e⁻: ${value}`, value, difficulty: 3 },
      { display: `${element.name}`, value, difficulty: 4 },
    );
  }
  
  const maxDifficulty = Math.ceil(level / 5) + 2;
  const filtered = expressions.filter(e => e.difficulty <= maxDifficulty);
  const finalList = filtered.length > 0 ? filtered : expressions;
  return finalList[Math.floor(Math.random() * finalList.length)];
}
