// services/moderation.service.ts
// Content moderation service with rule-based and AI moderation

import { GEMINI_API_KEY } from '../src/config/secrets';

const SENSITIVE_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'asshole',
  'stupid', 'idiot', 'moron', 'loser',
  'hate', 'kill', 'die',
  '傻逼', '操', '草', '妈的', '他妈的', '去死', '白痴', '智障', '垃圾',
  '蠢货', '废物', '傻子', '笨蛋', '弱智',
  // 新增变体
  '特么', '屌', '尼玛', '煞笔', 'sb', '傻b', '傻比',
  '妈逼', '妈b', '草泥马', 'cnm', '日', '艹',
  '废话', '鬼话', '放屁', '狗屁', '扯淡'
];

const SPAM_PATTERNS = [
  /(.)\1{5,}/gi, // Repeated characters
  /https?:\/\/[^\s]+/gi, // URL links
  /\b\d{10,}\b/g, // Long numbers
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
    suggestions.push('Please provide more details');
    severity = 'medium';
  }
  
  const sensitiveWords = detectSensitiveWords(text);
  if (sensitiveWords.length > 0) {
    issues.push('Inappropriate language detected');
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

export async function aiModerateContent(text: string): Promise<ModerationResult> {
  try {
    const response = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a content moderator for a hair system community platform. Analyze the following content in ANY language and determine if it's appropriate.

Content to review:
"""
${text}
"""

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "isClean": true or false,
  "issues": ["list of specific issues found"],
  "severity": "low" or "medium" or "high",
  "suggestions": ["list of suggestions to improve the content"]
}

Consider issues in ANY language (English, Chinese, Japanese, etc.):
- Offensive language or personal attacks
- Spam or promotional content
- Inappropriate topics (not related to hair systems/toupees)
- Hate speech or discrimination
- Threats or harassment
- Excessive negativity or trolling
- Medical misinformation

Be culturally aware and understand context. Some criticism is okay if constructive.`
            }]
          }],
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini API response');
    }
    
    let resultText = data.candidates[0].content.parts[0].text;
    
    // Remove markdown code blocks if present
    resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(resultText);
    
    return {
      isClean: result.isClean,
      issues: result.issues || [],
      severity: result.severity || 'low',
      suggestions: result.suggestions || []
    };
    
  } catch (error) {
    console.error('AI moderation error:', error);
    // Fallback to rule-based moderation
    return moderateContent(text);
  }
}

export async function smartModerate(text: string): Promise<ModerationResult> {
  // Step 1: Quick rule-based check
  const ruleResult = moderateContent(text);
  
  // Step 2: If high severity found by rules, block immediately
  if (ruleResult.severity === 'high') {
    return ruleResult;
  }
  
  // Step 3: If clean or low severity, use AI for deeper analysis
  if (ruleResult.isClean || ruleResult.severity === 'low') {
    try {
      return await aiModerateContent(text);
    } catch (error) {
      console.error('❌ AI moderation failed:', error);
      return ruleResult;
    }
  }
  // Step 4: Medium severity - return rule result
  return ruleResult;
}

export function quickCheck(text: string): boolean {
  return moderateContent(text).isClean;
}
