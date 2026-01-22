import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, clearAllData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Framework() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const stored = getStoredData();
    setData(stored);
    // Perform global validation
    const result = validateLFA(stored);
    setValidation(result);
  }, []);

  const handleDownload = () => {
    if (!data) return;
    
    const content = generateFrameworkText();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute(
      'download',
      `${data.program?.name || 'Program'}_LogicalFramework.txt`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditSection = (section) => {
    const routes = {
      basics: '/basics',
      problem: '/problem-outcome',
      stakeholders: '/stakeholders',
      activities: '/activities'
    };
    if (routes[section]) {
      navigate(routes[section]);
    }
  };

  const handleStartNew = () => {
    if (window.confirm('Clear all data and start a new program design?')) {
      clearAllData();
      navigate('/');
    }
  };

  const generateFrameworkText = () => {
    if (!data) return '';

    const lfa = data;
    const lines = [
      'LOGICAL FRAMEWORK ANALYSIS',
      '',
      lfa.program?.name || 'Program Design',
      '',
      '='.repeat(80),
      'PROGRAM BASICS',
      '='.repeat(80),
      '',
      `Program Name: ${lfa.program?.name || 'Not set'}`,
      `Description: ${lfa.program?.description || 'Not set'}`,
      '',
      '='.repeat(80),
      'PROBLEM & OUTCOME',
      '='.repeat(80),
      '',
      `Problem: ${lfa.problemContext?.problem || 'Not set'}`,
      '',
      // Show Main Goal separately if possible
      `Program Goal: ${lfa.outcomes?.find(o => o.id === 'out-001')?.statement || lfa.outcomes?.[0]?.statement || 'Not set'}`,
      '',
      '='.repeat(80),
      'STAKEHOLDERS & BEHAVIOR CHANGE',
      '='.repeat(80),
      ''
    ];

    if (lfa.detailedStakeholders) {
        lfa.detailedStakeholders.forEach((s, idx) => {
            lines.push(`Stakeholder ${idx + 1}: ${s.name}`);
            s.changes.forEach(c => {
                lines.push(`  - Current: ${c.current}`);
                lines.push(`    Goal: ${c.target}`);
                lines.push(`    Indicator: ${c.indicator}`);
            });
            lines.push('');
        });
    } else {
        (lfa.changeTheory?.stakeholders || []).forEach((s, idx) => {
            lines.push(`Stakeholder ${idx + 1}: ${s.name}`);
            lines.push(`  Current Practices: ${s.currentState?.practices || 'Not set'}`);
            lines.push(`  Target Practices: ${s.desiredChange?.targetPractices || 'Not set'}`);
            lines.push('');
        });
    }

    lines.push('='.repeat(80));
    lines.push('ACTIVITIES & OUTPUTS');
    lines.push('='.repeat(80));
    lines.push('');

    (lfa.activities || []).forEach((a, idx) => {
        lines.push(`Activity ${idx + 1}: ${a.description}`);
        lines.push(`  Implementer: ${a.implementer || 'Not set'}`);
        lines.push(`  Timeline: ${a.timeline?.startDate || a.timeline || 'Not set'}`);
        lines.push(`  Output: ${a.producesOutputs?.[0]?.mechanism || 'Not set'}`);
        // Try to find linked text
        const linkedOutlineId = a.producesOutputs?.[0]?.outputId ? 
            (lfa.outputs?.find(opt => opt.id === a.producesOutputs[0].outputId)?.linksToOutcome?.outcomeId) : null;
        if(linkedOutlineId) {
             const outcomeMatches = lfa.outcomes?.find(o => o.id === linkedOutlineId);
             lines.push(`  Supports: ${outcomeMatches?.statement || 'Outcome ID ' + linkedOutlineId}`);
        }
        lines.push('');
    });

    lines.push('='.repeat(80));
    lines.push('SUMMARY STATISTICS');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Total Stakeholders: ${(lfa.changeTheory?.stakeholders || []).length}`);
    lines.push(`Total Activities: ${(lfa.activities || []).length}`);
    lines.push(`Total Outcomes: ${(lfa.outcomes || []).length}`);
    lines.push('');
    lines.push('='.repeat(80));
    lines.push('VALIDATION SUMMARY');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Total Errors: ${validation?.summary?.errors || 0}`);
    lines.push(`Total Warnings: ${validation?.summary?.warnings || 0}`);
    lines.push(`Status: ${validation?.summary?.errors === 0 ? 'READY' : 'NEEDS WORK'}`);
    lines.push('');
    lines.push('Generated: ' + new Date().toLocaleString());

    return lines.join('\n');
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading framework...</p>
        </div>
      </div>
    );
  }

  const mainGoal = data.outcomes?.find(o => o.id === 'out-001') || data.outcomes?.[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressBar currentStep={5} totalSteps={5} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="mb-10 text-center">
             <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
               <span className="text-4xl">🎉</span>
            </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Your Program Design (Complete!)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review your complete Logical Framework Analysis. Everything aligns?
            Download the structured text file or start fresh.
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="rounded-2xl border-blue-50 bg-blue-50/10 text-center py-6">
                <div className="text-3xl font-bold text-blue-600">
                {data.program?.name ? '✓' : '○'}
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium uppercase tracking-wide">Program Name</p>
                <p className="font-semibold text-gray-900 mt-1 truncate px-2">{data.program?.name || 'Not set'}</p>
            </Card>

           <Card className="rounded-2xl border-blue-50 bg-blue-50/10 text-center py-6">
                 <div className="text-3xl font-bold text-blue-600">
                    {(data.changeTheory?.stakeholders || []).length}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 font-medium uppercase tracking-wide">Stakeholders</p>
           </Card>

            <Card className="rounded-2xl border-blue-50 bg-blue-50/10 text-center py-6">
                <div className="text-3xl font-bold text-blue-600">
                {(data.activities || []).length}
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium uppercase tracking-wide">Activities</p>
            </Card>

            <Card className="rounded-2xl border-blue-50 bg-blue-50/10 text-center py-6">
                <div className={`text-3xl font-bold ${validation?.summary?.errors === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {validation?.summary?.errors === 0 ? 'READY' : 'CHECK'}
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium uppercase tracking-wide">Overall Status</p>
            </Card>
        </div>

        {/* Validation Summary */}
        <div className="mb-8">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">!</span>
                AI Reliability Check
             </h3>
             {validation?.resultsBySeverity?.warning?.length > 0 || validation?.resultsBySeverity?.error?.length > 0 ? (
                <ValidationDisplay validationResult={validation} />
             ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    All logic checks passed. Your framework appears internally consistent.
                </div>
             )}
        </div>

        {/* Logical Framework Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gray-900 text-white px-8 py-6">
            <h2 className="text-xl font-bold tracking-tight">Logical Framework Matrix</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Problem & Context</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Stakeholders & Change</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Activities & Outputs</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Impact & Indicators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 text-sm text-gray-700 align-top">
                    {data.problemContext?.problem ? (
                      <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-900 mb-1">Core Problem</p>
                            <p className="text-gray-700">{data.problemContext.problem}</p>
                        </div>
                         <button
                          onClick={() => handleEditSection('problem')}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                        >
                          ✎ Edit Problem
                        </button>
                      </div>
                    ) : (
                      <span className="text-red-500 italic">Not set</span>
                    )}
                  </td>

                  <td className="px-6 py-6 text-sm text-gray-700 align-top">
                    <div className="space-y-4">
                        {data.detailedStakeholders ? (
                            data.detailedStakeholders.map((s, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-400">
                                    <p className="font-bold text-gray-900 mb-2">{s.name}</p>
                                    <div className="space-y-3">
                                        {s.changes?.map((c, cIdx) => (
                                            <div key={cIdx} className="text-xs bg-white p-2 rounded border border-gray-100">
                                                <div className="mb-1"><span className="font-semibold text-gray-500">Current:</span> {c.current}</div>
                                                <div className="mb-1"><span className="font-semibold text-green-600">Goal:</span> {c.target}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            (data.changeTheory?.stakeholders || []).map((s, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                    <p className="font-bold text-gray-900">{s.name}</p>
                                    <div className="mt-2 text-xs grid gap-2">
                                        <div>Target: {s.desiredChange?.targetPractices}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                      onClick={() => handleEditSection('stakeholders')}
                       className="text-blue-600 hover:text-blue-800 text-xs font-semibold mt-2"
                    >
                      ✎ Edit Stakeholders
                    </button>
                  </td>

                  <td className="px-6 py-6 text-sm text-gray-700 align-top">
                     <div className="space-y-4">
                        {(data.activities || []).map((a, idx) => (
                           <div key={idx} className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-400">
                                <p className="font-bold text-gray-900">{a.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Output: {a.producesOutputs?.[0]?.mechanism}</p>
                           </div>
                        ))}
                     </div>
                    <button
                      onClick={() => handleEditSection('activities')}
                       className="text-blue-600 hover:text-blue-800 text-xs font-semibold mt-2"
                    >
                      ✎ Edit Activities
                    </button>
                  </td>
                  
                  <td className="px-6 py-6 text-sm text-gray-700 align-top">
                     <div className="mb-6 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <p className="font-bold text-gray-900 mb-1">Program Goal</p>
                        <p>{mainGoal?.statement || 'Not set'}</p>
                     </div>

                    <p className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-2">Detailed Statistics</p>
                    {(data.outcomes || []).map((o, idx) => (
                        o.id !== 'out-001' && (
                            <div key={idx} className="mb-3 pl-2 border-l-2 border-green-200">
                                <p className="text-xs font-medium text-gray-900 mb-1">{o.statement.substring(0, 60)}...</p>
                                 <ul className="list-disc pl-4 space-y-0.5">
                                    {o.indicators?.map((ind, i) => (
                                        <li key={i} className="text-xs text-gray-600">{ind.value || ind.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              className="w-full justify-center"
            >
              📥 Download as Text
            </Button>
            
             <Button
              variant="outline"
              size="lg"
              onClick={handlePrint}
               className="w-full justify-center"
            >
              🖨️ Print Framework
            </Button>
          </div>
           <div className="mt-6 flex justify-center">
                 <button 
                  onClick={handleStartNew}
                  className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
                 >
                    Start Over (Clear All Data)
                 </button>
           </div>
        </div>
      </div>
    </div>
  );
}

