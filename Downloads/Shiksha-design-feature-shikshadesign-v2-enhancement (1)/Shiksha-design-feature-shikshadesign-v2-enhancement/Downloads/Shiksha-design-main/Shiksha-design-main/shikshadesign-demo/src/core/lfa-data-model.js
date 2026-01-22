/**
 * LFA Data Model (JSON Schema)
 * 
 * This is the canonical data structure representing a Logical Framework Analysis.
 * It directly maps to the Common LFA hierarchy:
 * Problem → Stakeholders → Practice Change → Outcomes → Outputs → Activities → Indicators
 * 
 * Core Principle:
 * - Structure enforces logical alignment
 * - No field should exist without a reason
 * - Every field must be traceable back to Common LFA
 */

export const LFA_DATA_MODEL = {
  // Metadata
  metadata: {
    version: '1.0',
    createdAt: 'ISO8601 timestamp',
    updatedAt: 'ISO8601 timestamp',
    status: 'draft | active | archived'
  },

  // SECTION 1: PROGRAM IDENTITY
  program: {
    name: 'string (required)',
    description: 'string (required)',
    startDate: 'ISO8601 date',
    endDate: 'ISO8601 date',
    theme: 'string (e.g., health, education, livelihood)',
    geographies: ['string array']
  },

  // SECTION 2: PROBLEM CONTEXT (Root of the LFA)
  // Why do we exist? What problem are we solving?
  problemContext: {
    // Core problem statement
    problem: {
      statement: 'string (required) - clear, specific problem',
      affectedGroups: 'string - who is affected?',
      rootCauses: ['string array - why does this happen?'],
      severity: 'high | medium | low - relative severity',
      evidence: 'string - what data supports this?'
    },

    // Opportunity for change
    opportunity: {
      statement: 'string - what is possible?',
      assumptions: ['string array - what must be true?']
    }
  },

  // SECTION 3: CHANGE THEORY (Stakeholders & Practice Change)
  // WHO must change? HOW must they change?
  changeTheory: {
    stakeholders: [
      {
        id: 'unique-id',
        name: 'string (required) - e.g., "Smallholder farmers"',
        description: 'string - who exactly are they?',
        
        // Current state
        currentState: {
          practices: 'string - what do they do now?',
          knowledge: 'string - what do they know/not know?',
          attitudes: 'string - what do they believe?',
          access: 'string - what barriers do they face?'
        },

        // Desired change
        desiredChange: {
          targetPractices: 'string (required) - what should they do?',
          targetKnowledge: 'string - what should they know?',
          targetAttitudes: 'string - what should they believe?',
          targetAccess: 'string - what barriers should be removed?',
          timeframe: 'string - by when? (e.g., "18 months")'
        },

        // How will change happen?
        changePathways: [
          {
            mechanism: 'string - e.g., "training", "incentive", "access"',
            description: 'string',
            linkToActivity: 'activity-id - which activity enables this?'
          }
        ]
      }
    ]
  },

  // SECTION 4: OUTCOMES (What change do we want to see?)
  // Outcomes = stakeholder + practice change at scale
  outcomes: [
    {
      id: 'unique-id',
      
      // Outcome statement
      statement: 'string (required) - e.g., "Farmers adopt improved irrigation"',
      
      // Link to problem
      addressesProblem: 'string - which problem does this solve?',
      
      // Link to stakeholders
      affectsStakeholders: ['stakeholder-id array'],

      // Scope
      scope: {
        population: 'string - how many people?',
        geography: 'string - where?',
        timeframe: 'string - by when?'
      },

      // How do we know it happened? (Indicators)
      indicators: [
        {
          id: 'unique-id',
          statement: 'string (required) - measurable outcome',
          
          // Metric definition
          metric: {
            name: 'string',
            numerator: 'string - what are we counting?',
            denominator: 'string - out of what?',
            unit: 'percentage | number | ratio | etc',
            target: 'number (required) - e.g., 80',
            baseline: 'number - where are we starting?'
          },

          // Data collection
          dataSource: 'string - where does this data come from?',
          dataCollectionMethod: 'string - how do we collect it?',
          frequency: 'baseline | midline | endline | annual | etc',
          responsibility: 'string - who collects this?'
        }
      ]
    }
  ],

  // SECTION 5: OUTPUTS (What do we deliver?)
  // Outputs = direct results of activities
  // Outputs enable outcomes (but don't guarantee them)
  outputs: [
    {
      id: 'unique-id',
      
      // Output statement
      statement: 'string (required) - e.g., "200 farmers trained on drip irrigation"',
      
      // What type of output?
      type: 'training | service | asset | knowledge | infrastructure | policy | etc',

      // Scope
      scope: {
        scale: 'number - how many units? (e.g., 200 people)',
        quality: 'string - quality standard',
        timeframe: 'string - by when?'
      },

      // Link to outcome
      linksToOutcome: {
        outcomeId: 'outcome-id (required)',
        mechanism: 'string - how does this output enable the outcome?',
        assumptions: ['string array - what must be true?']
      },

      // How do we know we delivered?
      indicators: [
        {
          id: 'unique-id',
          statement: 'string - e.g., "200 farmers completed training"',
          metric: {
            target: 'number (required)',
            unit: 'people | events | materials | etc'
          },
          dataSource: 'string',
          responsibility: 'string'
        }
      ]
    }
  ],

  // SECTION 6: ACTIVITIES (What do we do?)
  // Activities = the work we do
  // Activities produce outputs
  activities: [
    {
      id: 'unique-id',
      
      // Activity description
      description: 'string (required) - clear description of what we do',
      
      // Activity type
      type: 'training | support | facilitation | provision | policy | research | etc',

      // Who does it?
      implementer: 'string - who implements? (e.g., "Shikshagraha staff")',
      
      // Who participates?
      participants: 'string - who takes part?',

      // When?
      timeline: {
        startDate: 'ISO8601 date',
        endDate: 'ISO8601 date',
        duration: 'string - e.g., "3 days"',
        frequency: 'string - e.g., "monthly"'
      },

      // Where?
      locations: ['string array'],

      // Link to outputs
      producesOutputs: [
        {
          outputId: 'output-id (required)',
          mechanism: 'string - how does this activity produce that output?'
        }
      ],

      // Resources needed
      resources: {
        budget: 'number - cost in local currency',
        staff: 'string - staffing requirements',
        materials: ['string array - what materials needed?'],
        partners: ['string array - who helps deliver this?']
      }
    }
  ],

  // SECTION 7: ASSUMPTIONS & RISKS
  // External factors that could affect the LFA
  contextualFactors: {
    assumptions: [
      {
        id: 'unique-id',
        statement: 'string - e.g., "Government will pass policy"',
        level: 'global | outcome-level | output-level | activity-level',
        probability: 'high | medium | low',
        mitigation: 'string - what can we do if this fails?'
      }
    ],
    
    risks: [
      {
        id: 'unique-id',
        statement: 'string - e.g., "Drought reduces farmer participation"',
        level: 'high | medium | low',
        mitigation: 'string - how do we manage this?'
      }
    ]
  },

  // SECTION 8: PARTNERS & ROLES
  partners: [
    {
      id: 'unique-id',
      name: 'string - organization name',
      role: 'implementer | funder | beneficiary | advisor | etc',
      responsibilities: ['string array'],
      contact: 'email or phone'
    }
  ],

  // SECTION 9: BUDGET & RESOURCES (Simplified for MVP)
  budget: {
    totalBudget: 'number - in local currency',
    currency: 'string - e.g., "INR"',
    period: 'string - e.g., "2024-2025"',
    breakdown: {
      personnelCosts: 'number',
      operationalCosts: 'number',
      programCosts: 'number'
    }
  }
};

/**
 * Example: Filled-in LFA for "Rural Health Access Initiative"
 */
export const EXAMPLE_LFA = {
  metadata: {
    version: '1.0',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    status: 'draft'
  },

  program: {
    name: 'Rural Health Access Initiative',
    description: 'Improve health outcomes in 5 districts through community health workers',
    startDate: '2024-06-01',
    endDate: '2026-05-31',
    theme: 'health',
    geographies: ['District A', 'District B']
  },

  problemContext: {
    problem: {
      statement:
        'Rural communities lack access to basic primary healthcare, leading to high maternal and child mortality.',
      affectedGroups: '500,000 people in 5 districts',
      rootCauses: [
        'No health facilities within 10km',
        'Community health workers untrained',
        'Limited health literacy',
        'Weak supply chains for medicines'
      ],
      severity: 'high',
      evidence:
        'District health department reports 150+ preventable deaths annually'
    },
    opportunity: {
      statement:
        'Training and equipping community health workers can fill the primary care gap.',
      assumptions: [
        'Communities will support CHWs',
        'Government will provide regulatory framework'
      ]
    }
  },

  changeTheory: {
    stakeholders: [
      {
        id: 'chw-001',
        name: 'Community Health Workers',
        description: 'Selected from local communities, 1 per 500 people',
        currentState: {
          practices: 'Limited health knowledge; refer all cases to distant clinics',
          knowledge: 'Basic first aid only',
          attitudes: 'Willing to serve but lack confidence',
          access: 'No training resources or supplies'
        },
        desiredChange: {
          targetPractices:
            'Diagnose and treat common illnesses; counsel on prevention',
          targetKnowledge: 'ASHA competencies: 50+ conditions',
          targetAttitudes: 'Confident in their role; seen as trusted leaders',
          targetAccess: 'Regular training, medical kits, supervision',
          timeframe: '12 months'
        },
        changePathways: [
          {
            mechanism: 'training',
            description: '5-day certification training + ongoing supervision',
            linkToActivity: 'act-001'
          },
          {
            mechanism: 'supply',
            description: 'Medical kits and reference materials',
            linkToActivity: 'act-002'
          }
        ]
      },
      {
        id: 'comm-001',
        name: 'Community Members',
        description: 'Patients and health seekers',
        currentState: {
          practices:
            'Travel 10+ km to clinic; often self-treat with unproven remedies',
          knowledge: 'Limited health literacy; many misconceptions',
          attitudes: 'Skeptical of formal health services',
          access: 'No local healthcare'
        },
        desiredChange: {
          targetPractices:
            'Seek care locally from trained CHW; follow preventive guidance',
          targetKnowledge: 'Basic hygiene, nutrition, disease prevention',
          targetAttitudes: 'Trust and use local health services',
          targetAccess: 'Health services within 1km',
          timeframe: '18 months'
        },
        changePathways: [
          {
            mechanism: 'access',
            description: 'Trained CHW in their village',
            linkToActivity: 'act-001'
          },
          {
            mechanism: 'knowledge',
            description: 'Health education campaigns',
            linkToActivity: 'act-003'
          }
        ]
      }
    ]
  },

  outcomes: [
    {
      id: 'out-001',
      statement:
        'Community members access quality primary healthcare services from trained health workers',
      addressesProblem: 'Lack of local primary healthcare',
      affectsStakeholders: ['chw-001', 'comm-001'],
      scope: {
        population: '250,000 people',
        geography: '5 districts',
        timeframe: '18 months'
      },
      indicators: [
        {
          id: 'ind-001',
          statement: '80% of eligible population receives at least one service',
          metric: {
            name: 'Coverage',
            numerator: 'People who received service',
            denominator: 'Total eligible population',
            unit: 'percentage',
            target: 80,
            baseline: 5
          },
          dataSource: 'CHW service registers',
          dataCollectionMethod: 'Monthly reports',
          frequency: 'monthly',
          responsibility: 'CHW supervisors'
        },
        {
          id: 'ind-002',
          statement:
            'Maternal mortality reduces by 30% in program areas compared to baseline',
          metric: {
            name: 'Maternal Mortality Ratio',
            numerator: 'Maternal deaths',
            denominator: 'Live births',
            unit: 'per 100,000 live births',
            target: 140,
            baseline: 200
          },
          dataSource: 'Government vital statistics',
          dataCollectionMethod: 'Annual survey',
          frequency: 'annual',
          responsibility: 'District health department'
        }
      ]
    }
  ],

  outputs: [
    {
      id: 'out-supply-001',
      statement: '500 community health workers trained and certified',
      type: 'training',
      scope: {
        scale: 500,
        quality: '90% pass final assessment',
        timeframe: '12 months'
      },
      linksToOutcome: {
        outcomeId: 'out-001',
        mechanism:
          'Trained CHWs are able to provide quality primary healthcare',
        assumptions: ['CHWs remain in their villages', 'Communities support them']
      },
      indicators: [
        {
          id: 'ind-out-001',
          statement: '500 CHWs complete 5-day training',
          metric: { target: 500, unit: 'people' },
          dataSource: 'Training attendance records',
          responsibility: 'Training coordinator'
        },
        {
          id: 'ind-out-002',
          statement: '450 CHWs pass certification exam (90%)',
          metric: { target: 450, unit: 'people' },
          dataSource: 'Exam results',
          responsibility: 'Training coordinator'
        }
      ]
    }
  ],

  activities: [
    {
      id: 'act-001',
      description:
        'Conduct 5-day CHW certification training in 100 batches of 5 participants each',
      type: 'training',
      implementer: 'Shikshagraha + District Health Office',
      participants: 'Community Health Workers (500 total)',
      timeline: {
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        duration: '5 days per batch',
        frequency: 'Weekly batches'
      },
      locations: ['All 5 districts'],
      producesOutputs: [
        {
          outputId: 'out-supply-001',
          mechanism:
            'Training builds CHW competencies in basic healthcare provision'
        }
      ],
      resources: {
        budget: 500000,
        staff: '2 full-time trainers + 5 part-time facilitators',
        materials: ['Training modules', 'Reference guides', 'Practice kits'],
        partners: ['District Health Office', 'NGO Partner X']
      }
    }
  ],

  contextualFactors: {
    assumptions: [
      {
        id: 'ass-001',
        statement: 'Government will support CHW deployment',
        level: 'global',
        probability: 'high',
        mitigation: 'Engage health department early; formalize MOU'
      }
    ],
    risks: [
      {
        id: 'risk-001',
        statement: 'CHWs leave villages for better opportunities',
        level: 'medium',
        mitigation: 'Provide incentives; build community support'
      }
    ]
  },

  partners: [
    {
      id: 'partner-001',
      name: 'District Health Department',
      role: 'implementer',
      responsibilities: ['CHW coordination', 'Supply chain support'],
      contact: 'dho@district.gov'
    }
  ],

  budget: {
    totalBudget: 1500000,
    currency: 'INR',
    period: '2024-2026',
    breakdown: {
      personnelCosts: 600000,
      operationalCosts: 400000,
      programCosts: 500000
    }
  }
};
