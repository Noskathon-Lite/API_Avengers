export interface User {
    id: number;
    email: string;
    subscription: 'free' | 'pro';
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    signup: (name: string, email: string, password: string) => Promise<any>; // Update here
    logout: () => Promise<void>;
  }
  
  export interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
  }
  
  export interface PricingCardProps {
    title: string;
    price: string;
    period: string;
    features: string[];
    popular?: boolean;
    onSubscribe: () => void;
  }
  
  export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
  }