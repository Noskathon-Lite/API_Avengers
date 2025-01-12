import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) {
      navigate('/profile', { state: { from: '/pricing', plan } });
      return;
    }
    // Handle subscription logic
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Upgrade to Pro</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get access to advanced features and unlimited presentations
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="Monthly"
            price="$12"
            period="/month"
            features={[
              "Unlimited presentations",
              "AI-powered diagrams",
              "Video generation",
              "Smart chatbot assistant",
              "Priority support"
            ]}
            onSubscribe={() => handleSubscribe('monthly')}
          />

          <PricingCard
            title="Yearly"
            price="$99"
            period="/year"
            features={[
              "Everything in Monthly",
              "2 months free",
              "Team collaboration",
              "Custom branding",
              "API access"
            ]}
            popular
            onSubscribe={() => handleSubscribe('yearly')}
          />
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ title, price, period, features, popular, onSubscribe }) => (
  <div className={`
    rounded-2xl p-8 bg-white shadow-lg border-2
    ${popular ? 'border-indigo-500' : 'border-transparent'}
  `}>
    {popular && (
      <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-indigo-600 bg-indigo-50 mb-4">
        Most Popular
      </span>
    )}
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    <div className="mt-4 flex items-baseline">
      <span className="text-4xl font-bold text-gray-900">{price}</span>
      <span className="ml-1 text-xl text-gray-500">{period}</span>
    </div>
    <ul className="mt-8 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="h-5 w-5 text-indigo-500 mr-3" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onSubscribe}
      className={`
        mt-8 w-full py-3 px-4 rounded-lg font-semibold
        ${popular 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }
        transition-colors duration-200
      `}
    >
      Get Started
    </button>
  </div>
);

export default PricingPage;