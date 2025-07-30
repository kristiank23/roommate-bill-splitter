import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, Edit3, Mail, Upload, Users, Home, Zap, Wifi, Tv, Droplets, CheckCircle, Calendar, DollarSign, Clock } from 'lucide-react';

const RoommateBillSplitter = () => {
  const [currentView, setCurrentView] = useState('onboarding'); // 'onboarding' or 'home'
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceProviders, setServiceProviders] = useState({});
  const [properties, setProperties] = useState([{ id: 1, name: '', address: '', roommates: [{ id: 1, name: '', email: '' }] }]);
  const [splitMethods, setSplitMethods] = useState({});
  const [emailConnected, setEmailConnected] = useState(false);
  const [timeframe, setTimeframe] = useState('month');

  const serviceTypes = [
    { id: 'electricity', name: 'Electricity', icon: Zap, category: 'Utilities' },
    { id: 'gas', name: 'Gas', icon: Zap, category: 'Utilities' },
    { id: 'water', name: 'Water', icon: Droplets, category: 'Utilities' },
    { id: 'internet', name: 'Internet', icon: Wifi, category: 'Utilities' },
    { id: 'streaming', name: 'Streaming TV', icon: Tv, category: 'Entertainment' },
    { id: 'music', name: 'Music Streaming', icon: Tv, category: 'Entertainment' },
    { id: 'gaming', name: 'Gaming Subscription', icon: Tv, category: 'Entertainment' },
  ];

  const providersByService = {
    electricity: ['ConEd', 'PSEG', 'National Grid', 'Other'],
    gas: ['ConEd', 'National Grid', 'PSEG', 'Other'],
    water: ['NYC Water', 'Local Water Authority', 'Other'],
    internet: ['Verizon Fios', 'Spectrum', 'Optimum', 'Xfinity', 'Other'],
    streaming: ['Netflix', 'YouTube TV', 'Hulu', 'HBO Max', 'Disney+', 'Other'],
    music: ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Other'],
    gaming: ['Xbox Game Pass', 'PlayStation Plus', 'Nintendo Online', 'Other'],
  };

  const splitMethodOptions = [
    { id: 'equal', name: 'Equal Split', icon: '⚖️' },
    { id: 'custom', name: 'Custom Amount', icon: '💰' },
    { id: 'exclude', name: 'Exclude Some', icon: '👥' }
  ];

  // Mock bill data for home screen
  const mockBills = [
    { id: 'electricity-1', service: 'Electricity', provider: 'ConEd', amount: 125, dueDate: '2025-08-15', property: 'Main House' },
    { id: 'internet-1', service: 'Internet', provider: 'Verizon Fios', amount: 80, dueDate: '2025-08-10', property: 'Main House' },
    { id: 'streaming-1', service: 'Streaming TV', provider: 'YouTube TV', amount: 65, dueDate: '2025-08-05', property: 'Main House' },
  ];

  const addService = (service) => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
    const newProviders = { ...serviceProviders };
    delete newProviders[serviceId];
    setServiceProviders(newProviders);
  };

  const addCustomService = () => {
    const name = prompt('Enter service name:');
    if (name) {
      const customService = {
        id: `custom-${Date.now()}`,
        name,
        icon: Zap,
        category: 'Custom'
      };
      addService(customService);
    }
  };

  const updateProvider = (serviceId, provider) => {
    setServiceProviders({ ...serviceProviders, [serviceId]: provider });
  };

  const addProperty = () => {
    setProperties([...properties, { 
      id: Date.now(), 
      name: '', 
      address: '', 
      roommates: [{ id: Date.now(), name: '', email: '' }] 
    }]);
  };

  const updateProperty = (propertyId, field, value) => {
    setProperties(properties.map(p => 
      p.id === propertyId ? { ...p, [field]: value } : p
    ));
  };

  const addRoommate = (propertyId) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
        ? { ...p, roommates: [...p.roommates, { id: Date.now(), name: '', email: '' }] }
        : p
    ));
  };

  const updateRoommate = (propertyId, roommateId, field, value) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
        ? { 
            ...p, 
            roommates: p.roommates.map(r => 
              r.id === roommateId ? { ...r, [field]: value } : r
            )
          }
        : p
    ));
  };

  const removeRoommate = (propertyId, roommateId) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
        ? { ...p, roommates: p.roommates.filter(r => r.id !== roommateId || p.roommates.length === 1) }
        : p
    ));
  };

  const connectEmail = () => {
    setEmailConnected(true);
    setTimeout(() => {
      setCurrentView('home');
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getTotalRoommates = () => {
    return properties.reduce((total, property) => 
      total + property.roommates.filter(r => r.name.trim()).length, 0
    );
  };

  const getTimeframeMultiplier = () => {
    switch(timeframe) {
      case 'week': return 0.25;
      case 'year': return 12;
      default: return 1;
    }
  };

  const getTotalAmount = () => {
    return mockBills.reduce((sum, bill) => sum + bill.amount, 0) * getTimeframeMultiplier();
  };

  const getPerPersonAmount = () => {
    const totalRoommates = getTotalRoommates();
    return totalRoommates > 0 ? getTotalAmount() / totalRoommates : 0;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Services</h2>
        <p className="text-gray-600">Choose the utilities and services you'd like to split</p>
      </div>

      {/* Group services by category */}
      {['Utilities', 'Entertainment'].map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceTypes.filter(service => service.category === category).map((service) => {
              const Icon = service.icon;
              const isSelected = selectedServices.find(s => s.id === service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => isSelected ? removeService(service.id) : addService(service)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium text-sm">{service.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={addCustomService}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Custom Service
      </button>

      {selectedServices.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">Selected Services:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <span key={service.id} className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {service.name}
                <button onClick={() => removeService(service.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Providers</h2>
        <p className="text-gray-600">Choose the provider for each service</p>
      </div>

      <div className="space-y-4">
        {selectedServices.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <service.icon className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">{service.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(providersByService[service.id] || ['Other']).map((provider) => (
                <button
                  key={provider}
                  onClick={() => updateProvider(service.id, provider)}
                  className={`p-3 text-center border rounded-lg transition-colors ${
                    serviceProviders[service.id] === provider
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{provider}</div>
                </button>
              ))}
            </div>
            {serviceProviders[service.id] === 'Other' && (
              <input
                type="text"
                placeholder="Enter provider name"
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Properties & Roommates</h2>
        <p className="text-gray-600">Add your properties and roommates for each location</p>
      </div>

      <div className="space-y-6">
        {properties.map((property, propertyIndex) => (
          <div key={property.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Property {propertyIndex + 1}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  value={property.name}
                  onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                  placeholder="Main House, Apartment A, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={property.address}
                  onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                  placeholder="123 Main St, City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Roommates</h4>
              </div>
              <div className="space-y-2">
                {property.roommates.map((roommate, roommateIndex) => (
                  <div key={roommate.id} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={roommate.name}
                        onChange={(e) => updateRoommate(property.id, roommate.id, 'name', e.target.value)}
                        placeholder={`Roommate ${roommateIndex + 1} name`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="email"
                        value={roommate.email}
                        onChange={(e) => updateRoommate(property.id, roommate.id, 'email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {property.roommates.length > 1 && (
                      <button
                        onClick={() => removeRoommate(property.id, roommate.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addRoommate(property.id)}
                  className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Roommate
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProperty}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Property
        </button>
      </div>

      {/* Consolidated Split Methods */}
      {selectedServices.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-medium text-gray-900 mb-4">Split Methods</h3>
          <div className="grid gap-3">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <service.icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-gray-500">({serviceProviders[service.id] || 'No provider'})</span>
                </div>
                <div className="flex gap-1">
                  {splitMethodOptions.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSplitMethods({...splitMethods, [service.id]: method.id})}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        splitMethods[service.id] === method.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {method.icon} {method.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Bills</h2>
        <p className="text-gray-600">Connect your email to automatically parse bills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={connectEmail}
          className={`p-6 border-2 rounded-xl transition-all ${
            emailConnected
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-blue-500 bg-blue-50 text-blue-700 hover:border-blue-600'
          }`}
        >
          <Mail className="w-8 h-8 mx-auto mb-3" />
          <div className="font-medium mb-1">
            {emailConnected ? 'Email Connected!' : 'Connect Email'}
          </div>
          <div className="text-sm opacity-70">
            {emailConnected ? 'Ready to parse bills automatically' : 'Gmail, Outlook, Yahoo supported'}
          </div>
          {emailConnected && <CheckCircle className="w-5 h-5 mx-auto mt-2" />}
        </button>

        <button className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-gray-700">
          <Upload className="w-8 h-8 mx-auto mb-3" />
          <div className="font-medium mb-1">Upload Bills</div>
          <div className="text-sm opacity-70">Manually upload PDF/images</div>
        </button>
      </div>

      {emailConnected && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="font-medium text-green-900 mb-2">Setup Complete! 🎉</h3>
          <p className="text-green-700 text-sm mb-4">
            Your bill splitting is ready. Redirecting to your dashboard...
          </p>
        </div>
      )}
    </div>
  );

  const renderHomeScreen = () => (
    <div className="space-y-6">
      {/* Header with timeframe toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Manage your shared bills and roommates</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="font-medium text-gray-900">Total Bills</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">${getTotalAmount().toFixed(0)}</div>
          <div className="text-sm text-gray-600">Per {timeframe}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="font-medium text-gray-900">Your Share</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">${getPerPersonAmount().toFixed(0)}</div>
          <div className="text-sm text-gray-600">Per {timeframe}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="font-medium text-gray-900">Next Due</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">Aug 5</div>
          <div className="text-sm text-gray-600">YouTube TV - $65</div>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-4">Properties & Roommates</h3>
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{property.name || 'Unnamed Property'}</h4>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {property.roommates.filter(r => r.name.trim()).length} roommates
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {property.roommates.filter(r => r.name.trim()).map((roommate) => (
                  <span key={roommate.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {roommate.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bills Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-4">Recent Bills</h3>
        <div className="space-y-3">
          {mockBills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{bill.service}</h4>
                  <p className="text-sm text-gray-600">{bill.provider} • Due {bill.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">${bill.amount}</div>
                <div className="text-sm text-gray-600">${(bill.amount / getTotalRoommates()).toFixed(0)} per person</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BillSplit</h1>
                <p className="text-gray-600 mt-1">Split utility bills with roommates, effortlessly</p>
              </div>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {renderHomeScreen()}
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Services', description: 'Select services' },
    { number: 2, title: 'Providers', description: 'Choose providers' },
    { number: 3, title: 'Setup', description: 'Properties & roommates' },
    { number: 4, title: 'Connect', description: 'Connect bills' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">BillSplit</h1>
          <p className="text-gray-600 mt-1">Split utility bills with roommates, effortlessly</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === 4 || (currentStep === 1 && selectedServices.length === 0) || (currentStep === 2 && Object.keys(serviceProviders).length < selectedServices.length)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
              currentStep === 4 || (currentStep === 1 && selectedServices.length === 0) || (currentStep === 2 && Object.keys(serviceProviders).length < selectedServices.length)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentStep === 4 ? 'Complete' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoommateBillSplitter;