import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LoanCalculator = () => {
  const [formData, setFormData] = useState({
    vehiclePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '',
    additionalCosts: ''
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateMonthlyPayment = (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const calculateTotalLoanCost = (monthlyPayment, years) => {
    return monthlyPayment * years * 12;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    
    if (numValue < 0) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.vehiclePrice || !formData.interestRate || !formData.loanTerm) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    const principal = formData.vehiclePrice - (formData.downPayment || 0) + (formData.additionalCosts || 0);
    
    // Calcular escenarios con diferentes tasas
    const scenarios = [];
    const baseRate = formData.interestRate;
    [-1, -0.5, 0, 0.5, 1].forEach(rateAdjustment => {
      const rate = baseRate + rateAdjustment;
      const monthlyPayment = calculateMonthlyPayment(principal, rate, formData.loanTerm);
      const totalCost = calculateTotalLoanCost(monthlyPayment, formData.loanTerm);
      
      scenarios.push({
        apr: rate.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
        totalCost: totalCost.toFixed(2),
        term: formData.loanTerm
      });
    });

    setResults(scenarios);
    setError('');
  };

  const handleReset = () => {
    setFormData({
      vehiclePrice: '',
      downPayment: '',
      interestRate: '',
      loanTerm: '',
      additionalCosts: ''
    });
    setResults(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calculadora de Financiamiento de Vehículos</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Precio del Vehículo ($)</label>
            <input
              type="number"
              name="vehiclePrice"
              value={formData.vehiclePrice}
              onChange={handleInputChange}
              placeholder="30000"
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Pronto Pago ($)</label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              placeholder="5000"
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1">Tasa de Interés APR (%)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              placeholder="5.9"
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Plazo (años)</label>
            <input
              type="number"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleInputChange}
              placeholder="5"
              className="w-full p-2 border rounded"
              min="1"
              max="10"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Costos Adicionales ($)</label>
            <input
              type="number"
              name="additionalCosts"
              value={formData.additionalCosts}
              onChange={handleInputChange}
              placeholder="1000"
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Calcular
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Reiniciar
          </button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">APR (%)</th>
                  <th className="border p-2">Plazo (años)</th>
                  <th className="border p-2">Pago Mensual ($)</th>
                  <th className="border p-2">Costo Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((scenario, index) => (
                  <tr key={index}>
                    <td className="border p-2">{scenario.apr}</td>
                    <td className="border p-2">{scenario.term}</td>
                    <td className="border p-2">${scenario.monthlyPayment}</td>
                    <td className="border p-2">${scenario.totalCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results}>
                <XAxis dataKey="apr" label={{ value: 'APR (%)', position: 'bottom' }} />
                <YAxis label={{ value: 'Pago Mensual ($)', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="monthlyPayment" stroke="#2563eb" name="Pago Mensual" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {Number(formData.loanTerm) > 5 && (
            <Alert>
              <AlertDescription>
                ¡Atención! Los plazos más largos aumentan significativamente el costo total del préstamo.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;