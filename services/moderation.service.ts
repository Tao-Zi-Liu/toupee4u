// services/moderation.service.ts
// Content moderation service - Rule-based detection only

const SENSITIVE_WORDS = [
  // English profanity
  'fuck', 'shit', 'damn', 'bitch', 'asshole',
  // English insults
  'stupid', 'idiot', 'moron', 'loser',
  // English hate speech
  'hate', 'kill', 'die',
  // Chinese profanity
  '傻逼', '操', '草', '妈的', '他妈的', '去死', '白痴', '智障', '垃圾',
  // Chinese insults
  '蠢货', '废物', '傻子', '笨蛋', '弱智',
];

const SPAM_PATTERNS = [
  /(.)\1{5,}/gi, // Repeated characters (aaaaa)
  /https?:\/\/[^\s]+/gi, // URL links
  /\b\d{10,}\b/g, // Long numbers (phone numbers)
];

export interface ModerationResult {
  isClean: boolean;
  issues: string[];
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
}

function detectSensitiveWords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  
  SENSITIVE_WORDS.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      found.push(word);
    }
  });
  
  return found;
}

function detectSpam(text: string): string[] {
  const issues: string[] = [];
  
  SPAM_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(text)) {
      switch(index) {
        case 0:
          issues.push('Excessive repeated characters');
          break;
        case 1:
          issues.push('Suspicious links detected');
          break;
        case 2:
          issues.push('Possible phone number or spam');
          break;
      }
    }
  });
  
  return issues;
}

function detectShouting(text: string): boolean {
  const words = text.split(/\s+/);
  const capsWords = words.filter(word => 
    word.length > 3 && word === word.toUpperCase() && /[A-Z]/.test(word)
  );
  
  return capsWords.length > words.length * 0.5;
}

export function moderateContent(text: string): ModerationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  
  if (!text.trim()) {
    return {
      isClean: false,
      issues: ['Content is empty'],
      severity: 'high',
      suggestions: ['Please enter some content']
    };
  }
  
  if (text.length < 10) {
    issues.push('Content is too short');
    suggestions.push('Please provide more details (at least 10 characters)');
    severity = 'medium';
  }
  
  const sensitiveWords = detectSensitiveWords(text);
  if (sensitiveWords.length > 0) {
    issues.push(`Inappropriate language detected: ${sensitiveWords.join(', ')}`);
    suggestions.push('Please remove offensive language');
    severity = 'high';
  }
  
  const spamIssues = detectSpam(text);
  if (spamIssues.length > 0) {
    issues.push(...spamIssues);
    suggestions.push('Please remove spam-like content');
    severity = severity === 'high' ? 'high' : 'medium';
  }
  
  if (detectShouting(text)) {
    issues.push('Excessive use of capital letters');
    suggestions.push('Please use normal capitalization');
    severity = severity === 'high' ? 'high' : 'low';
  }
  
  return {
    isClean: issues.length === 0,
    issues,
    severity,
    suggestions
  };
}

export function quickCheck(text: string): boolean {
  return moderateContent(text).isClean;
}
