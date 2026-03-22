import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ 
  productName = '', 
  customMessage = '',
  className = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState('919876543210');

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('tr_traders_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.whatsappNumber) setPhoneNumber(parsed.whatsappNumber);
      }
    };
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);
  
  const generateWhatsAppLink = () => {
    const defaultMessage = productName 
      ? `Hi, I'm interested in "${productName}". Can you share more details?`
      : 'Hi, I would like to inquire about a custom order.';
    
    const message = customMessage || defaultMessage;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <a
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-whatsapp text-white px-6 py-3 rounded-md font-medium shadow-md hover:bg-green-600 transition-colors animate-pulse-soft ${className}`}
    >
      <MessageCircle size={20} className="text-white" />
      <span>Enquire on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
