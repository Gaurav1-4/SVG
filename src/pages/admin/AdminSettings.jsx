import { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Store, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '../../components/Toast';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'TR Traders',
    whatsappNumber: '919876543210',
    email: 'contact@trtraders.com',
    address: '123 Heritage Lane, Chandni Chowk, Delhi 110006',
    currency: 'INR',
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('tr_traders_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem('tr_traders_settings', JSON.stringify(settings));
      
      // Dispatch event to update other components naturally
      window.dispatchEvent(new Event('settingsUpdated'));
      
      showToast('Settings saved successfully!');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <SettingsIcon size={28} className="text-primary" />
        <h1 className="text-2xl font-serif font-medium text-text">Store Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg text-text font-serif font-medium mb-5 border-b border-border pb-3">
            General Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <Store size={16} className="text-gray-400"/> Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <span className="text-gray-400 font-bold">₹</span> Currency Code
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg text-text font-serif font-medium mb-5 border-b border-border pb-3">
            Contact Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <Phone size={16} className="text-gray-400"/> WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                placeholder="Include country code (e.g., 919876543210)"
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
              <p className="text-xs text-muted">Include country code without + (e.g., 9198...)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <Mail size={16} className="text-gray-400"/> Store Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <MapPin size={16} className="text-gray-400"/> Physical Address
              </label>
              <textarea
                name="address"
                rows="3"
                value={settings.address}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 focus:ring-4 focus:ring-accent/20 transition-all shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
