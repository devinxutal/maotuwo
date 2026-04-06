/**
 * Cube formula input validation & normalization utilities.
 *
 * Valid tokens:  R L U D F B M r l u d f b x y z
 * Each may be followed by: ' or 2 or 2'
 * Parentheses () are allowed and must be balanced.
 */

// All valid base letters (case-sensitive)
const BASE_LETTERS = 'RLUDFBMrludfbxyz';
const BASE_RE = new RegExp(`[${BASE_LETTERS}]`);

// Full-width → half-width mapping
const FULLWIDTH_MAP: Record<string, string> = {
  '\u2018': "'", // '
  '\u2019': "'", // '
  '\u0060': "'", // `
  '\u00B4': "'", // ´
  '\uFF07': "'", // ＇ full-width apostrophe
  '\u2032': "'", // ′ prime
  '\uFF08': '(', // （
  '\uFF09': ')', // ）
  '\u300C': '(', // 「
  '\u300D': ')', // 」
};

/**
 * Replace full-width quotes and brackets with half-width equivalents.
 */
export function fixFullWidth(input: string): string {
  let result = '';
  for (const ch of input) {
    result += FULLWIDTH_MAP[ch] ?? ch;
  }
  return result;
}

/**
 * Tokenize a formula string into an array of tokens.
 * Each token is one of: a move (e.g. "R", "R'", "R2", "R2'"), "(", ")", or a number (e.g. "3").
 * Unknown characters are returned as-is for error reporting.
 */
export function tokenize(formula: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < formula.length) {
    const ch = formula[i];

    // Skip whitespace
    if (/\s/.test(ch)) { i++; continue; }

    // Parentheses
    if (ch === '(' || ch === ')') {
      tokens.push(ch);
      i++;
      continue;
    }

    // Numbers (repetition after parentheses)
    if (/\d/.test(ch)) {
      let num = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        num += formula[i];
        i++;
      }
      tokens.push(num);
      continue;
    }

    // Base move letter
    if (BASE_RE.test(ch)) {
      let token = ch;
      i++;
      // Check for optional suffix: 2, ', or 2'
      if (i < formula.length && formula[i] === '2') {
        token += '2';
        i++;
        if (i < formula.length && formula[i] === "'") {
          token += "'";
          i++;
        }
      } else if (i < formula.length && formula[i] === "'") {
        token += "'";
        i++;
      }
      tokens.push(token);
      continue;
    }

    // Unknown character — push as-is
    tokens.push(ch);
    i++;
  }
  return tokens;
}

/**
 * Validate a list of tokens. Returns null if valid, or an error message.
 */
export function validateTokens(tokens: string[]): string | null {
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === '(') {
      depth++;
    } else if (t === ')') {
      depth--;
      if (depth < 0) return '括号不匹配：多余的 )';
    } else if (/^\d+$/.test(t)) {
      // Repetition number must follow a closing parenthesis
      const prev = i > 0 ? tokens[i - 1] : '';
      if (prev !== ')') {
        return `数字 "${t}" 只能跟在右括号 ")" 后面`;
      }
    } else if (!BASE_RE.test(t[0])) {
      return `无效字符: "${t}"`;
    }
  }
  if (depth !== 0) return '括号不匹配：缺少 )';
  return null;
}

/**
 * Normalize a formula expression:
 * 1. Fix full-width characters
 * 2. Tokenize
 * 3. Re-assemble with proper spacing (no space inside parens touching tokens)
 *
 * Rules:
 * - Space between every two adjacent move tokens
 * - No space after "(" or before ")"
 * - Space before "(" unless at start
 * - Space after ")" unless at end or followed by ")" or a number
 * - No space between ")" and a following number
 */
export function normalizeFormula(raw: string): { normalized: string; error: string | null } {
  const fixed = fixFullWidth(raw.trim());
  if (!fixed) return { normalized: '', error: null };

  const tokens = tokenize(fixed);
  const error = validateTokens(tokens);

  // Re-assemble with spacing rules
  let result = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;

    // Determine if we need a space before this token
    if (prev !== null) {
      if (token === ')') {
        // No space before closing paren
      } else if (prev === '(') {
        // No space after opening paren
      } else if (/^\d+$/.test(token) && prev === ')') {
        // No space between closing paren and the number
      } else {
        result += ' ';
      }
    }

    result += token;
  }

  return { normalized: result, error };
}

/**
 * Generate the inverse of a formula.
 * Standard behavior:
 * - Reverse the order of moves
 * - Invert each move: R -> R', R' -> R, R2 -> R2, R2' -> R2
 * - Keep structural groups and repetitions intact, but recursively invert them: (A B)3 -> (B' A')3
 */
export function inverseFormula(formula: string): string {
  const { normalized, error } = normalizeFormula(formula);
  if (error || !normalized) return '';

  const tokens = tokenize(normalized);

  type AstNode = { type: 'move'; val: string } | { type: 'group'; children: AstNode[]; mult: string };
  let i = 0;

  function parseBlock(): AstNode[] {
    const nodes: AstNode[] = [];
    while (i < tokens.length) {
      const t = tokens[i];
      if (t === '(') {
        i++;
        const children = parseBlock();
        let mult = '';
        if (i < tokens.length && /^\d+$/.test(tokens[i])) {
          mult = tokens[i];
          i++;
        }
        nodes.push({ type: 'group', children, mult });
      } else if (t === ')') {
        i++;
        return nodes;
      } else {
        nodes.push({ type: 'move', val: t });
        i++;
      }
    }
    return nodes;
  }

  const ast = parseBlock();

  function invertAst(nodes: AstNode[]): AstNode[] {
    const inv: AstNode[] = [];
    for (let j = nodes.length - 1; j >= 0; j--) {
      const n = nodes[j];
      if (n.type === 'move') {
        let v = n.val;
        if (v.endsWith("'")) {
          v = v.slice(0, -1);
        } else if (v.endsWith('2')) {
          // 180 degree turn is its own inverse
          v = v;
        } else {
          v = v + "'";
        }
        inv.push({ type: 'move', val: v });
      } else {
        inv.push({ type: 'group', children: invertAst(n.children), mult: n.mult });
      }
    }
    return inv;
  }

  const invertedAst = invertAst(ast);

  function astToString(nodes: AstNode[]): string {
    let str = '';
    for (let j = 0; j < nodes.length; j++) {
      const n = nodes[j];
      if (j > 0) str += ' ';
      
      if (n.type === 'move') {
        str += n.val;
      } else {
        str += '(' + astToString(n.children) + ')' + n.mult;
      }
    }
    return str;
  }

  return normalizeFormula(astToString(invertedAst)).normalized;
}
