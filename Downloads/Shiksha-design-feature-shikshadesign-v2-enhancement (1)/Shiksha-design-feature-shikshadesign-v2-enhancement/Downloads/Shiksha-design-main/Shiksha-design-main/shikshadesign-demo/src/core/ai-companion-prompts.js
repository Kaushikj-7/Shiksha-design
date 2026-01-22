/**
 * AI Design Companion - Prompt Templates
 * 
 * These are the ONLY prompts allowed to interact with external LLMs.
 * All prompts are:
 * - Injected with project context
 * - Constrained to specific tasks
 * - No free-form generation
 * - Explanatory only (not generative of primary content)
 * 
 * The AI Companion is NOT a chatbot. It's a guided expert voice.
 */

import { LFA_DATA_MODEL } from './lfa-data-model';

/**
 * System Prompt - Injected into every AI request
 * This sets the boundaries and personality of the AI
 */
export const SYSTEM_PROMPT = `You are an expert program design facilitator for NGOs using Logical Framework Analysis (LFA).

Your role:
- Explain WHY something is weak in program design
- Suggest HOW to improve clarity
- Offer examples of strong phrasing
- Reference Common LFA principles
- Support users, don't generate content

Your constraints:
- NEVER generate full problem statements, outcomes, or activities
- NEVER override user decisions
- NEVER suggest without explanation
- ALWAYS acknowledge uncertainty
- ALWAYS defer to the user's expertise
- Reference the Common LFA model provided

You are like an experienced Shikshagraha facilitator whispering guidance - not a chatbot, not a generator.

If asked something outside your scope, respond: "I can only help with program design guidance. For [topic], please consult with your team."
`;

/**
 * PROMPT 1: Explain Weak Content
 * 
 * Usage: User writes something weak → AI explains why it's weak
 * Example: User: "Our outcome is: Improve health"
 *          AI: "This outcome is too vague. It doesn't specify who, what scale, or by when..."
 */
export function createExplainWeakContentPrompt(content, contentType, lfaContext) {
  return {
    role: 'user',
    content: `
I wrote this ${contentType}:

"${content}"

Using Common LFA principles, explain why this might be weak or unclear. Be specific.

Context from my program:
Problem: ${lfaContext?.problem || 'Not yet defined'}
Stakeholders: ${lfaContext?.stakeholders || 'Not yet defined'}

Keep your response under 100 words and focus on ONE main weakness.
`
  };
}

/**
 * PROMPT 2: Suggest Improvements
 * 
 * Usage: User has weak content → AI suggests how to improve (but doesn't rewrite)
 * Example: User: "Why is 'Improve health' weak?"
 *          AI: "Try making it specific: name WHO improves (farmers), WHAT improves (income),  MEASURE IT (by 20%), TIMEFRAME (12 months)"
 */
export function createSuggestImprovementsPrompt(content, contentType, weakness, lfaContext) {
  return {
    role: 'user',
    content: `
My ${contentType} is:
"${content}"

The main issue is: ${weakness}

Using Common LFA, what elements should I add or clarify? 
- Don't rewrite it for me
- Just tell me WHAT to add and WHY
- Give ONE concrete example

Context:
Problem: ${lfaContext?.problem || 'Not defined'}
Stakeholders: ${lfaContext?.stakeholders || 'Not defined'}

Keep it under 80 words.
`
  };
}

/**
 * PROMPT 3: Validate Logic Alignment
 * 
 * Usage: Check if Activity → Output → Outcome logic is clear
 * Example: User adds activity "Train farmers" → Output "500 farmers trained"
 *          AI: "The logic is clear: training produces trained farmers. But HOW does this lead to your outcome of 'increased yields'? What's missing?"
 */
export function createValidateLogicPrompt(activity, output, outcome) {
  return {
    role: 'user',
    content: `
I have:
- Activity: "${activity}"
- Output: "${output}"
- Outcome: "${outcome}"

Is the logic clear? Does the output actually lead to the outcome?
- Point out any logical gaps
- Don't rewrite anything
- Be specific about what's missing

Keep it under 100 words.
`
  };
}

/**
 * PROMPT 4: Clarify Stakeholder Change
 * 
 * Usage: Help user be specific about HOW a stakeholder will change
 * Example: User: "Farmers should adopt better practices"
 *          AI: "That's the target. But WHAT practices exactly? HOW will they learn? What will change them?"
 */
export function createClarifyStakeholderChangePrompt(stakeholder, currentPractice, targetPractice, lfaContext) {
  return {
    role: 'user',
    content: `
For my stakeholder "${stakeholder}":
- Currently: "${currentPractice}"
- Should be: "${targetPractice}"

Is this change specific and realistic? 
- What would actually change in their daily behavior?
- What barriers need to be removed?
- What incentives matter?

Don't rewrite it. Just point out what's unclear.

Keep it under 100 words.
`
  };
}

/**
 * PROMPT 5: Suggest Indicators
 * 
 * Usage: Help user think about how to measure an outcome
 * Example: User has outcome but no indicator
 *          AI: "You could measure this by: 1) Survey asking farmers... 2) Monitor health records... 3) Count clinic visits..."
 */
export function createSuggestIndicatorsPrompt(outcome, stakeholders = []) {
  return {
    role: 'user',
    content: `
My outcome is:
"${outcome}"

Affected stakeholders: ${stakeholders.join(', ') || 'Not specified'}

What are 3 ways I could MEASURE whether this outcome happened?
- For each, explain: What would you count? Where would data come from?
- Don't write full indicators, just give ideas
- Pick practical, feasible approaches

Keep it under 150 words.
`
  };
}

/**
 * PROMPT 6: Check for Assumptions
 * 
 * Usage: Identify hidden assumptions in the LFA
 * Example: User assumes farmers will attend training
 *          AI: "You're assuming: 1) Farmers are interested 2) They can afford to attend 3) They trust your organization. Have you tested these?"
 */
export function createIdentifyAssumptionsPrompt(lfaSection, sectionType) {
  return {
    role: 'user',
    content: `
Looking at my ${sectionType}:
${JSON.stringify(lfaSection, null, 2)}

What am I ASSUMING will be true for this to work?
- List 3-5 key assumptions
- Be specific (not generic)
- Don't include things you control

For each assumption, ask: "Have I tested this?"

Keep it under 150 words.
`
  };
}

/**
 * PROMPT 7: Explain Common LFA Principle
 * 
 * Usage: User asks "What's the difference between output and outcome?"
 *        AI: Explains with clarity and examples
 */
export function createExplainLFAPrinciplePrompt(principle) {
  return {
    role: 'user',
    content: `
Explain this Common LFA principle to an NGO new to program design:

"${principle}"

Include:
1. What it means
2. Why it matters
3. One real example

Keep it under 100 words and use simple language.
`
  };
}

/**
 * PROMPT 8: Review Activity-Output Alignment
 * 
 * Usage: Check that activities actually produce outputs
 * Example: Activity "Hold meetings" → Output "10 meetings held" - is this real?
 *          AI: "Meetings are an activity, not an output. An output would be: what people learn or decide in those meetings."
 */
export function createReviewActivityOutputAlignmentPrompt(activities) {
  return {
    role: 'user',
    content: `
I've defined these activities and claimed outputs:

${activities
  .map(
    (a, idx) => `
Activity ${idx + 1}: "${a.description}"
Claimed Output: "${a.output}"
`
  )
  .join('')}

For each, is the output REAL? Does the activity actually PRODUCE it?
- If output is just a description of the activity, flag it
- Suggest what a real output would be
- Keep it under 150 words total
`
  };
}

/**
 * PROMPT 9: Suggest Implementation Pathway
 * 
 * Usage: Help user think through execution
 * Example: User defines an activity but unclear on HOW to do it
 *          AI: "Breaking this down: 1) First recruit participants... 2) Then prepare materials... 3) Then execute..."
 */
export function createSuggestImplementationPathwayPrompt(activity, stakeholders, context) {
  return {
    role: 'user',
    content: `
I want to implement this activity:
"${activity}"

With these stakeholders: ${stakeholders.join(', ')}

What steps should I plan for, in order?
- Don't write a plan for me
- Just outline the logical sequence
- Point out any missing pieces

Context: ${context || 'NGO with limited resources'}

Keep it under 120 words.
`
  };
}

/**
 * PROMPT 10: Validate Indicator Quality
 * 
 * Usage: Check if indicators are actually measurable
 * Example: Indicator "Farmers feel empowered" → AI: "This is vague. How do you measure 'feel'?"
 */
export function createValidateIndicatorQualityPrompt(indicator, metric) {
  return {
    role: 'user',
    content: `
My indicator is:
"${indicator}"

Metric: ${metric}

Is this actually MEASURABLE?
- Can you collect this data reliably?
- Is it specific enough?
- What's unclear?

Don't rewrite it. Just give honest feedback.

Keep it under 80 words.
`
  };
}

/**
 * SAFETY: Detect if user is asking for content generation
 * 
 * If user asks: "Write my problem statement"
 * Return: "I can't write that for you. But I can help you develop it. What's the main issue?"
 */
export function detectContentGenerationRequest(userMessage) {
  const bannedPhrases = [
    'write my',
    'generate',
    'create a',
    'write a',
    'compose a',
    'draft my',
    'come up with',
    'think of'
  ];

  const lowerMessage = userMessage.toLowerCase();
  return bannedPhrases.some(phrase => lowerMessage.includes(phrase));
}

/**
 * SAFETY: Guardrails for AI Response
 * 
 * Before sending AI response to user, check:
 * 1. Is it explanatory or generative?
 * 2. Does it overstep into user decisions?
 * 3. Is it concise and actionable?
 */
export function validateAIResponse(response) {
  const guardrails = {
    isExplanatory: !response.includes("Here's your") && 
                   !response.includes("Here is your") &&
                   !response.includes("You should write"),
    
    respectsUserAgency: !response.includes("You must") && 
                        !response.includes("Change this to"),
    
    isConcise: response.length < 500,
    
    hasDisclaimers: response.includes("?") || response.includes("consider") || response.includes("might"),
    
    isActionable: response.includes("suggest") || 
                  response.includes("consider") || 
                  response.includes("try"),
  };

  const passed = Object.values(guardrails).filter(v => v === true).length >= 4;
  return { passed, guardrails };
}

/**
 * FALLBACK RESPONSES
 * 
 * If AI unavailable or over quota, these provide guidance
 */
export const FALLBACK_RESPONSES = {
  weakOutcome:
    'Outcomes should be: specific (who changes?), measurable (how will you know?), time-bound (by when?), and achievable.',

  weakIndicator:
    'Good indicators have: clear metric (what are you counting?), target (how much?), data source (where from?), and feasibility.',

  weakActivity:
    'Activities should clearly produce outputs. Ask: What will people learn? What will they have? What will be different after?',

  weakStakeholder:
    'For each stakeholder, be clear: Who exactly? What do they do now? What should they do instead? How will that change happen?',

  unclear:
    'This is part of program design. The best way forward: 1) Define your problem clearly 2) Identify who must change 3) Decide how to measure success.'
};

/**
 * UTILITY: Create a session token for AI requests
 * This prevents the same question being asked repeatedly
 */
export function createRequestFingerprint(prompt, userId) {
  return `${userId}-${prompt.substring(0, 50)}`.replace(/[^a-zA-Z0-9-]/g, '');
}

export default {
  SYSTEM_PROMPT,
  createExplainWeakContentPrompt,
  createSuggestImprovementsPrompt,
  createValidateLogicPrompt,
  createClarifyStakeholderChangePrompt,
  createSuggestIndicatorsPrompt,
  createIdentifyAssumptionsPrompt,
  createExplainLFAPrinciplePrompt,
  createReviewActivityOutputAlignmentPrompt,
  createSuggestImplementationPathwayPrompt,
  createValidateIndicatorQualityPrompt,
  detectContentGenerationRequest,
  validateAIResponse,
  FALLBACK_RESPONSES,
  createRequestFingerprint
};
