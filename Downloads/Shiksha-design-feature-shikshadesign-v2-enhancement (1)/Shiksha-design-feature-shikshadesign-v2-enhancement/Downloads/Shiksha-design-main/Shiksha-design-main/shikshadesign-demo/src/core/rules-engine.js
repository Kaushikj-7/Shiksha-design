/**
 * Rules Engine - Deterministic Logic Layer
 * 
 * This is where ALL validation logic lives.
 * These are the "silent expert" rules that check logical alignment.
 * 
 * PRINCIPLE: Every rule is deterministic, explainable, and tied to Common LFA.
 * 
 * Rules are organized by validation level:
 * 1. Field-level validation (does this field exist and make sense?)
 * 2. Section-level validation (is this section internally coherent?)
 * 3. Cross-section validation (are sections aligned with each other?)
 * 4. Global validation (is the entire LFA logically sound?)
 */

/**
 * SEVERITY LEVELS
 */
export const SEVERITY = {
  ERROR: 'error', // Must fix to proceed
  WARNING: 'warning', // Should fix; logic is weak
  INFO: 'info', // Informational
  SUCCESS: 'success' // Something is done well
};

/**
 * VALIDATION RESULT STRUCTURE
 */
export class ValidationResult {
  constructor(field, severity, message, suggestion = null) {
    this.field = field; // e.g., "problemContext.problem.statement"
    this.severity = severity; // ERROR | WARNING | INFO | SUCCESS
    this.message = message; // User-friendly message
    this.suggestion = suggestion; // Optional actionable suggestion
    this.timestamp = new Date().toISOString();
  }
}

/**
 * LEVEL 1: FIELD-LEVEL VALIDATION
 * Does the field exist? Is it in the right format?
 */
export class FieldValidator {
  static validateRequired(value, fieldName) {
    if (value === null || value === undefined || value === '') {
      return new ValidationResult(
        fieldName,
        SEVERITY.ERROR,
        `${fieldName} is required`,
        `Please fill in ${fieldName}.`
      );
    }
    return null;
  }

  static validateMinLength(value, minLength, fieldName) {
    if (value && value.trim().length < minLength) {
      return new ValidationResult(
        fieldName,
        SEVERITY.WARNING,
        `${fieldName} seems too short (${value.trim().length} characters)`,
        `Consider providing more detail (at least ${minLength} characters).`
      );
    }
    return null;
  }

  static validateNumber(value, fieldName, min = 0, max = 100) {
    if (value !== null && value !== undefined) {
      if (isNaN(value) || value < min || value > max) {
        return new ValidationResult(
          fieldName,
          SEVERITY.ERROR,
          `${fieldName} must be a number between ${min} and ${max}`,
          `Enter a valid number (e.g., ${Math.round((min + max) / 2)}).`
        );
      }
    }
    return null;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return new ValidationResult(
        'email',
        SEVERITY.ERROR,
        'Invalid email format',
        'Enter a valid email address.'
      );
    }
    return null;
  }
}

/**
 * LEVEL 2: SECTION-LEVEL VALIDATION
 * Is this section internally coherent?
 */
export class SectionValidator {
  /**
   * PROBLEM CONTEXT SECTION
   * Check: Problem statement is clear and specific
   */
  static validateProblemContext(problemContext) {
    const results = [];

    if (!problemContext) {
      return [
        new ValidationResult(
          'problemContext',
          SEVERITY.ERROR,
          'Problem context is missing',
          'Define what problem your program addresses.'
        )
      ];
    }

    // Problem statement must exist and be substantial
    const problemStmt = problemContext.problem?.statement;
    if (!problemStmt) {
      results.push(
        new ValidationResult(
          'problemContext.problem.statement',
          SEVERITY.ERROR,
          'Problem statement is required',
          'Clearly describe the problem you are addressing.'
        )
      );
    } else if (problemStmt.length < 20) {
      results.push(
        new ValidationResult(
          'problemContext.problem.statement',
          SEVERITY.WARNING,
          'Problem statement is very brief',
          'Provide more detail about the specific problem.'
        )
      );
    }

    // Root causes should be identified
    const rootCauses = problemContext.problem?.rootCauses || [];
    if (rootCauses.length === 0) {
      results.push(
        new ValidationResult(
          'problemContext.problem.rootCauses',
          SEVERITY.WARNING,
          'No root causes identified',
          'Understanding root causes helps design better solutions.'
        )
      );
    } else if (rootCauses.length < 2) {
      results.push(
        new ValidationResult(
          'problemContext.problem.rootCauses',
          SEVERITY.INFO,
          'Only one root cause identified',
          'Consider if there are multiple contributing factors.'
        )
      );
    }

    // Opportunity should be defined if problem is defined
    const opportunity = problemContext.opportunity?.statement;
    if (!opportunity) {
      results.push(
        new ValidationResult(
          'problemContext.opportunity.statement',
          SEVERITY.WARNING,
          'No opportunity statement provided',
          'Describe what could be possible if the problem is addressed.'
        )
      );
    }

    return results;
  }

  /**
   * CHANGE THEORY SECTION
   * Check: Stakeholders are clearly defined with practice changes
   */
  static validateChangeTheory(changeTheory) {
    const results = [];

    if (!changeTheory || !changeTheory.stakeholders) {
      return [
        new ValidationResult(
          'changeTheory',
          SEVERITY.ERROR,
          'Change theory is not defined',
          'Identify stakeholders who must change.'
        )
      ];
    }

    const stakeholders = changeTheory.stakeholders;

    if (stakeholders.length === 0) {
      results.push(
        new ValidationResult(
          'changeTheory.stakeholders',
          SEVERITY.ERROR,
          'No stakeholders identified',
          'Add at least one stakeholder group that must change.'
        )
      );
      return results;
    }

    // Check each stakeholder
    stakeholders.forEach((stakeholder, idx) => {
      const prefix = `changeTheory.stakeholders[${idx}]`;

      // Name required
      if (!stakeholder.name) {
        results.push(
          new ValidationResult(
            `${prefix}.name`,
            SEVERITY.ERROR,
            `Stakeholder ${idx + 1}: name is required`,
            `Identify who this stakeholder is.`
          )
        );
      }

      // Current state must be described
      if (!stakeholder.currentState?.practices) {
        results.push(
          new ValidationResult(
            `${prefix}.currentState.practices`,
            SEVERITY.ERROR,
            `Stakeholder ${idx + 1}: current practices not described`,
            `Describe what they currently do.`
          )
        );
      }

      // CRITICAL: Desired change must be clear
      if (!stakeholder.desiredChange?.targetPractices) {
        results.push(
          new ValidationResult(
            `${prefix}.desiredChange.targetPractices`,
            SEVERITY.ERROR,
            `Stakeholder ${idx + 1}: desired practice change not defined`,
            `Clearly state what they should do differently.`
          )
        );
      }

      // Timeframe for change should be specified
      if (!stakeholder.desiredChange?.timeframe) {
        results.push(
          new ValidationResult(
            `${prefix}.desiredChange.timeframe`,
            SEVERITY.WARNING,
            `Stakeholder ${idx + 1}: no timeframe for change`,
            `When should this change happen? (e.g., "6 months", "by project end")`
          )
        );
      }

      // Change pathways should link to activities
      const pathways = stakeholder.changePathways || [];
      if (pathways.length === 0) {
        results.push(
          new ValidationResult(
            `${prefix}.changePathways`,
            SEVERITY.WARNING,
            `Stakeholder ${idx + 1}: no change mechanisms identified`,
            `How will this stakeholder change? (through training? incentives? access?)`
          )
        );
      }
    });

    return results;
  }

  /**
   * OUTCOMES SECTION
   * Check: Each outcome is specific, measurable, and linked to stakeholders
   */
  static validateOutcomes(outcomes, stakeholders = []) {
    const results = [];

    if (!outcomes || outcomes.length === 0) {
      results.push(
        new ValidationResult(
          'outcomes',
          SEVERITY.ERROR,
          'No outcomes defined',
          'Define what change you want to see (outcome).'
        )
      );
      return results;
    }

    outcomes.forEach((outcome, idx) => {
      const prefix = `outcomes[${idx}]`;

      // Outcome statement required
      if (!outcome.statement) {
        results.push(
          new ValidationResult(
            `${prefix}.statement`,
            SEVERITY.ERROR,
            `Outcome ${idx + 1}: statement is required`,
            `Write a clear outcome statement.`
          )
        );
      }

      // CRITICAL: Every outcome must have at least one indicator
      const indicators = outcome.indicators || [];
      if (indicators.length === 0) {
        results.push(
          new ValidationResult(
            `${prefix}.indicators`,
            SEVERITY.ERROR,
            `Outcome ${idx + 1}: not measurable (no indicators)`,
            `Add at least one measurable indicator showing this outcome happened.`
          )
        );
      } else {
        // Each indicator must be complete
        indicators.forEach((indicator, indIdx) => {
          if (!indicator.metric?.target) {
            results.push(
              new ValidationResult(
                `${prefix}.indicators[${indIdx}].metric.target`,
                SEVERITY.ERROR,
                `Outcome ${idx + 1}, Indicator ${indIdx + 1}: no target value`,
                `Specify a target (e.g., "80%", "500 people").`
              )
            );
          }
          if (!indicator.dataSource) {
            results.push(
              new ValidationResult(
                `${prefix}.indicators[${indIdx}].dataSource`,
                SEVERITY.WARNING,
                `Outcome ${idx + 1}, Indicator ${indIdx + 1}: no data source`,
                `How will you collect this data?`
              )
            );
          }
        });
      }

      // Scope should be defined
      if (
        !outcome.scope?.population ||
        !outcome.scope?.timeframe
      ) {
        results.push(
          new ValidationResult(
            `${prefix}.scope`,
            SEVERITY.WARNING,
            `Outcome ${idx + 1}: scope not fully defined`,
            `How many people? By when?`
          )
        );
      }

      // Link to stakeholders
      const affectedStakeholders = outcome.affectsStakeholders || [];
      if (affectedStakeholders.length === 0) {
        results.push(
          new ValidationResult(
            `${prefix}.affectsStakeholders`,
            SEVERITY.WARNING,
            `Outcome ${idx + 1}: not linked to any stakeholders`,
            `Which stakeholder groups does this outcome affect?`
          )
        );
      }
    });

    return results;
  }

  /**
   * OUTPUTS SECTION
   * Check: Each output is linked to an outcome and has delivery indicators
   */
  static validateOutputs(outputs, outcomes = []) {
    const results = [];

    if (!outputs || outputs.length === 0) {
      results.push(
        new ValidationResult(
          'outputs',
          SEVERITY.WARNING,
          'No outputs defined',
          'Outputs are the direct results of your activities.'
        )
      );
      return results;
    }

    const outcomeIds = new Set(outcomes.map(o => o.id));

    outputs.forEach((output, idx) => {
      const prefix = `outputs[${idx}]`;

      // Output statement required
      if (!output.statement) {
        results.push(
          new ValidationResult(
            `${prefix}.statement`,
            SEVERITY.ERROR,
            `Output ${idx + 1}: statement is required`,
            `Describe what you will deliver.`
          )
        );
      }

      // CRITICAL: Every output must link to an outcome
      const linkedOutcome = output.linksToOutcome?.outcomeId;
      if (!linkedOutcome) {
        results.push(
          new ValidationResult(
            `${prefix}.linksToOutcome`,
            SEVERITY.ERROR,
            `Output ${idx + 1}: not linked to any outcome`,
            `Select which outcome this output supports.`
          )
        );
      } else if (!outcomeIds.has(linkedOutcome)) {
        results.push(
          new ValidationResult(
            `${prefix}.linksToOutcome`,
            SEVERITY.ERROR,
            `Output ${idx + 1}: linked outcome does not exist`,
            `Create the linked outcome first.`
          )
        );
      }

      // Mechanism (how output enables outcome) should be clear
      if (!output.linksToOutcome?.mechanism) {
        results.push(
          new ValidationResult(
            `${prefix}.linksToOutcome.mechanism`,
            SEVERITY.WARNING,
            `Output ${idx + 1}: unclear how it enables outcome`,
            `Explain the logic: "This output enables that outcome because..."`
          )
        );
      }

      // Scale should be defined
      if (!output.scope?.scale) {
        results.push(
          new ValidationResult(
            `${prefix}.scope.scale`,
            SEVERITY.WARNING,
            `Output ${idx + 1}: scale not specified`,
            `How many people/units will you reach?`
          )
        );
      }

      // Output indicators
      const indicators = output.indicators || [];
      if (indicators.length === 0) {
        results.push(
          new ValidationResult(
            `${prefix}.indicators`,
            SEVERITY.WARNING,
            `Output ${idx + 1}: no delivery indicators`,
            `How will you track that you delivered this output?`
          )
        );
      }
    });

    return results;
  }

  /**
   * ACTIVITIES SECTION
   * Check: Each activity is linked to outputs and clearly defined
   */
  static validateActivities(activities, outputs = []) {
    const results = [];

    if (!activities || activities.length === 0) {
      results.push(
        new ValidationResult(
          'activities',
          SEVERITY.WARNING,
          'No activities defined',
          'Add activities - the work you will do.'
        )
      );
      return results;
    }

    const outputIds = new Set(outputs.map(o => o.id));

    activities.forEach((activity, idx) => {
      const prefix = `activities[${idx}]`;

      // Activity description required
      if (!activity.description) {
        results.push(
          new ValidationResult(
            `${prefix}.description`,
            SEVERITY.ERROR,
            `Activity ${idx + 1}: description is required`,
            `Clearly describe what you will do.`
          )
        );
      }

      // CRITICAL: Each activity must produce at least one output
      const producesOutputs = activity.producesOutputs || [];
      if (producesOutputs.length === 0) {
        results.push(
          new ValidationResult(
            `${prefix}.producesOutputs`,
            SEVERITY.ERROR,
            `Activity ${idx + 1}: not linked to any output`,
            `Select which output(s) this activity produces.`
          )
        );
      } else {
        // Validate each output link
        producesOutputs.forEach((link, linkIdx) => {
          if (!link.outputId) {
            results.push(
              new ValidationResult(
                `${prefix}.producesOutputs[${linkIdx}]`,
                SEVERITY.ERROR,
                `Activity ${idx + 1}: output link is incomplete`,
                `Select an output.`
              )
            );
          } else if (!outputIds.has(link.outputId)) {
            results.push(
              new ValidationResult(
                `${prefix}.producesOutputs[${linkIdx}]`,
                SEVERITY.ERROR,
                `Activity ${idx + 1}: linked output does not exist`,
                `Create the output first.`
              )
            );
          }

          if (!link.mechanism) {
            results.push(
              new ValidationResult(
                `${prefix}.producesOutputs[${linkIdx}].mechanism`,
                SEVERITY.WARNING,
                `Activity ${idx + 1}: unclear how it produces output`,
                `Explain: "This activity produces that output by..."`
              )
            );
          }
        });
      }

      // Timeline should be defined
      if (
        !activity.timeline?.startDate ||
        !activity.timeline?.endDate
      ) {
        results.push(
          new ValidationResult(
            `${prefix}.timeline`,
            SEVERITY.WARNING,
            `Activity ${idx + 1}: timeline not defined`,
            `When will this activity take place?`
          )
        );
      }

      // Implementer should be identified
      if (!activity.implementer) {
        results.push(
          new ValidationResult(
            `${prefix}.implementer`,
            SEVERITY.WARNING,
            `Activity ${idx + 1}: implementer not specified`,
            `Who will implement this activity?`
          )
        );
      }

      // Budget should be estimated
      if (!activity.resources?.budget) {
        results.push(
          new ValidationResult(
            `${prefix}.resources.budget`,
            SEVERITY.INFO,
            `Activity ${idx + 1}: budget not estimated`,
            `What will this activity cost?`
          )
        );
      }
    });

    return results;
  }
}

/**
 * LEVEL 3: CROSS-SECTION VALIDATION
 * Are different sections aligned with each other?
 */
export class CrossSectionValidator {
  /**
   * Check: Are all stakeholders' change pathways linked to activities?
   */
  static validateStakeholderActivityAlignment(changeTheory, activities) {
    const results = [];

    if (!changeTheory?.stakeholders || !activities) {
      return results;
    }

    const activityIds = new Set(activities.map(a => a.id));

    changeTheory.stakeholders.forEach((stakeholder, idx) => {
      const pathways = stakeholder.changePathways || [];

      pathways.forEach((pathway, pIdx) => {
        if (
          pathway.linkToActivity &&
          !activityIds.has(pathway.linkToActivity)
        ) {
          results.push(
            new ValidationResult(
              `changeTheory.stakeholders[${idx}].changePathways[${pIdx}]`,
              SEVERITY.WARNING,
              `Stakeholder "${stakeholder.name}": change pathway links to non-existent activity`,
              `Create the activity or remove the link.`
            )
          );
        }
      });
    });

    return results;
  }

  /**
   * Check: Are outcomes addressing the identified problem?
   */
  static validateOutcomeProblemAlignment(problemContext, outcomes) {
    const results = [];

    if (!problemContext?.problem?.statement || !outcomes?.length) {
      return results;
    }

    const problemStmt = problemContext.problem.statement.toLowerCase();
    let outcomesLinked = 0;

    outcomes.forEach((outcome, idx) => {
      if (
        outcome.addressesProblem &&
        outcome.addressesProblem.toLowerCase().includes('problem')
      ) {
        outcomesLinked++;
      }

      if (!outcome.addressesProblem) {
        results.push(
          new ValidationResult(
            `outcomes[${idx}].addressesProblem`,
            SEVERITY.INFO,
            `Outcome ${idx + 1}: not explicitly linked to problem`,
            `Reference which problem this outcome addresses.`
          )
        );
      }
    });

    return results;
  }

  /**
   * Check: Do outputs actually lead to outcomes? (Logic chain)
   */
  static validateLogicChain(outcomes, outputs) {
    const results = [];

    if (!outcomes || !outputs) {
      return results;
    }

    const outputsByOutcome = {};
    outputs.forEach(output => {
      const outcomeId = output.linksToOutcome?.outcomeId;
      if (outcomeId) {
        if (!outputsByOutcome[outcomeId]) {
          outputsByOutcome[outcomeId] = [];
        }
        outputsByOutcome[outcomeId].push(output);
      }
    });

    outcomes.forEach((outcome, idx) => {
      const linkedOutputs = outputsByOutcome[outcome.id] || [];

      if (linkedOutputs.length === 0) {
        results.push(
          new ValidationResult(
            `outcomes[${idx}].linkedOutputs`,
            SEVERITY.WARNING,
            `Outcome ${idx + 1}: no outputs are supporting it`,
            `Create or link outputs that will enable this outcome.`
          )
        );
      }
    });

    return results;
  }
}

/**
 * LEVEL 4: GLOBAL VALIDATION
 * Is the entire LFA logically sound?
 */
export class GlobalValidator {
  /**
   * Run ALL validation checks on the LFA
   */
  static validateCompleteLFA(lfa) {
    const allResults = [];

    // Section validations
    allResults.push(...SectionValidator.validateProblemContext(lfa.problemContext));
    allResults.push(...SectionValidator.validateChangeTheory(lfa.changeTheory));
    allResults.push(...SectionValidator.validateOutcomes(lfa.outcomes, lfa.changeTheory?.stakeholders));
    allResults.push(...SectionValidator.validateOutputs(lfa.outputs, lfa.outcomes));
    allResults.push(...SectionValidator.validateActivities(lfa.activities, lfa.outputs));

    // Cross-section validations
    allResults.push(
      ...CrossSectionValidator.validateStakeholderActivityAlignment(
        lfa.changeTheory,
        lfa.activities
      )
    );
    allResults.push(
      ...CrossSectionValidator.validateOutcomeProblemAlignment(
        lfa.problemContext,
        lfa.outcomes
      )
    );
    allResults.push(
      ...CrossSectionValidator.validateLogicChain(
        lfa.outcomes,
        lfa.outputs
      )
    );

    return allResults;
  }

  /**
   * Get summary statistics
   */
  static getSummary(validationResults) {
    const summary = {
      total: validationResults.length,
      errors: validationResults.filter(r => r.severity === SEVERITY.ERROR).length,
      warnings: validationResults.filter(r => r.severity === SEVERITY.WARNING).length,
      info: validationResults.filter(r => r.severity === SEVERITY.INFO).length,
      success: validationResults.filter(r => r.severity === SEVERITY.SUCCESS).length,
      isValid: validationResults.filter(r => r.severity === SEVERITY.ERROR).length === 0,
      completion: 0 // Calculated separately
    };

    return summary;
  }

  /**
   * Can the user proceed to next step?
   */
  static canProceed(validationResults) {
    const errors = validationResults.filter(r => r.severity === SEVERITY.ERROR);
    return errors.length === 0;
  }
}

/**
 * CONVENIENCE: Run validation and return structured result
 */
export function validateLFA(lfa) {
  const results = GlobalValidator.validateCompleteLFA(lfa);
  const summary = GlobalValidator.getSummary(results);
  const canProceed = GlobalValidator.canProceed(results);

  return {
    results,
    summary,
    canProceed,
    resultsByField: groupByField(results),
    resultsBySeverity: groupBySeverity(results)
  };
}

/**
 * HELPERS: Group results for easy display
 */
function groupByField(results) {
  const grouped = {};
  results.forEach(result => {
    if (!grouped[result.field]) {
      grouped[result.field] = [];
    }
    grouped[result.field].push(result);
  });
  return grouped;
}

function groupBySeverity(results) {
  const grouped = {};
  Object.values(SEVERITY).forEach(severity => {
    grouped[severity] = results.filter(r => r.severity === severity);
  });
  return grouped;
}

export default {
  FieldValidator,
  SectionValidator,
  CrossSectionValidator,
  GlobalValidator,
  ValidationResult,
  SEVERITY,
  validateLFA
};
