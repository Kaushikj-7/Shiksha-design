import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import InsightBox from '../components/InsightBox';
import ValidationDisplay from '../components/ValidationDisplay';
import { getStoredData, clearAllData } from '../utils/storage';
import { validateLFA } from '../core/rules-engine';

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
      `Desired Outcome: ${lfa.outcomes?.[0]?.statement || 'Not set'}`,
      '',
      `Indicator of Success: ${lfa.outcomes?.[0]?.indicators?.[0]?.name || 'Not set'}`,
      '',
      '='.repeat(80),
      'STAKEHOLDERS & PRACTICE CHANGE',
      '='.repeat(80),
      '',
      ...(lfa.changeTheory?.stakeholders || []).map((s, idx) => [
        `Stakeholder ${idx + 1}: ${s.name}`,
        `  Current Practices: ${s.currentState?.practices || 'Not set'}`,
        `  Target Practices: ${s.desiredChange?.targetPractices || 'Not set'}`,
        ''
      ]).flat(),
      '='.repeat(80),
      'ACTIVITIES & OUTPUTS',
      '='.repeat(80),
      '',
      ...(lfa.activities || []).map((a, idx) => [
        `Activity ${idx + 1}: ${a.description}`,
        `  Implementer: ${a.implementer || 'Not set'}`,
        `  Timeline: ${a.timeline || 'Not set'}`,
        `  Output: ${a.producesOutputs?.[0]?.mechanism || 'Not set'}`,
        ``
      ]).flat(),
      '',
      '='.repeat(80),
      'SUMMARY STATISTICS',
      '='.repeat(80),
      '',
      `Total Stakeholders: ${(lfa.changeTheory?.stakeholders || []).length}`,
      `Total Activities: ${(lfa.activities || []).length}`,
      `Total Outcomes: ${(lfa.outcomes || []).length}`,
      `Total Indicators: ${(lfa.outcomes || []).reduce((sum, o) => sum + (o.indicators?.length || 0), 0)}`,
      '',
      '='.repeat(80),
      'VALIDATION SUMMARY',
      '='.repeat(80),
      '',
      `Total Errors: ${validation?.summary?.errors || 0}`,
      `Total Warnings: ${validation?.summary?.warnings || 0}`,
      `Status: ${validation?.summary?.errors === 0 ? 'READY' : 'NEEDS WORK'}`,
      '',
      'Generated: ' + new Date().toLocaleString()
    ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={5} totalSteps={5} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Program Design (Complete!)
          </h1>
          <p className="text-gray-600">
            Review your complete Logical Framework Analysis. Everything aligns?
            Download or start fresh.
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {data.program?.name ? '✓' : '○'}
            </div>
            <p className="text-sm text-gray-600 mt-2">Program Name</p>
            <p className="font-semibold text-gray-900">{data.program?.name || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {(data.changeTheory?.stakeholders || []).length}
            </div>
            <p className="text-sm text-gray-600 mt-2">Stakeholders</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {(data.activities || []).length}
            </div>
            <p className="text-sm text-gray-600 mt-2">Activities</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className={`text-3xl font-bold ${validation?.summary?.errors === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {validation?.summary?.errors === 0 ? 'READY' : 'CHECK'}
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall Status</p>
          </div>
        </div>

        {/* Validation Summary */}
        {validation && <ValidationDisplay validationResult={validation} />}

        {/* Logical Framework Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="bg-gray-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Logical Framework</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Problem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Outcomes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stakeholders Changed</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Activities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {data.problemContext?.problem ? (
                      <>
                        <p className="font-medium">{data.problemContext.problem.substring(0, 100)}...</p>
                        <button
                          onClick={() => handleEditSection('problem')}
                          className="text-blue-600 hover:text-blue-700 text-xs mt-2 underline"
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <span className="text-red-500">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(data.outcomes || []).map((o, idx) => (
                      <div key={idx}>
                        <p className="font-medium">{o.statement?.substring(0, 50)}...</p>
                      </div>
                    ))}
                    <button
                      onClick={() => handleEditSection('problem')}
                      className="text-blue-600 hover:text-blue-700 text-xs mt-2 underline"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(data.changeTheory?.stakeholders || []).length} stakeholders
                    <br />
                    {(data.changeTheory?.stakeholders || [])
                      .slice(0, 2)
                      .map((s, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {s.name}
                        </p>
                      ))}
                    {(data.changeTheory?.stakeholders || []).length > 2 && (
                      <p className="text-xs text-gray-600">
                        + {(data.changeTheory?.stakeholders || []).length - 2} more
                      </p>
                    )}
                    <button
                      onClick={() => handleEditSection('stakeholders')}
                      className="text-blue-600 hover:text-blue-700 text-xs mt-2 underline"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(data.activities || []).length} activities
                    <br />
                    {(data.activities || [])
                      .slice(0, 2)
                      .map((a, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {a.description?.substring(0, 30)}...
                        </p>
                      ))}
                    {(data.activities || []).length > 2 && (
                      <p className="text-xs text-gray-600">
                        + {(data.activities || []).length - 2} more
                      </p>
                    )}
                    <button
                      onClick={() => handleEditSection('activities')}
                      className="text-blue-600 hover:text-blue-700 text-xs mt-2 underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              📥 Download as Text
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              🖨 Print
            </button>
            <button
              onClick={() => handleEditSection('basics')}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              ✏ Edit Program
            </button>
            <button
              onClick={handleStartNew}
              className="px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              🔄 Start New
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/activities')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Congratulations!</p>
            <p className="text-lg font-semibold text-gray-900">Program Design Complete</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>
    </div>
  );
}

