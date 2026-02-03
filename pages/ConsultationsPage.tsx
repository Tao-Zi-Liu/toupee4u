
import React, { useState } from 'react';
import { CONSULTATIONS } from '../constants';
import { 
  Video, 
  Clock, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert, 
  Zap, 
  Scissors, 
  X, 
  ChevronRight,
  User, 
  Mail, 
  FileText, 
  Check, 
  CreditCard, 
  Lock 
} from 'lucide-react';

export const ConsultationsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [step, setStep] = useState(1);
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
  const [paymentData, setPaymentData] = useState({ card: '', expiry: '', cvc: '' });

  const openBooking = (consult: any) => {
    setSelectedConsultation(consult);
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setPaymentData({ card: '', expiry: '', cvc: '' });
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: string) => setSelectedDate(date);
  const handleTimeSelect = (time: string) => setSelectedTime(time);

  const handleNextStep = () => {
    if (step === 1 && selectedDate && selectedTime) setStep(2);
    else if (step === 2 && formData.name && formData.email) setStep(3);
    else if (step === 3 && paymentData.card && paymentData.expiry && paymentData.cvc) setStep(4);
  };

  const getIcon = (id: string) => {
    switch(id) {
      case 'emergency': return <ShieldAlert className="w-6 h-6" />;
      case 'style': return <Scissors className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getColorTheme = (id: string) => {
    switch(id) {
      case 'emergency': return {
        bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', 
        hoverBorder: 'hover:border-red-500', button: 'bg-red-600 hover:bg-red-500', shadow: 'shadow-red-500/20',
        gradient: 'from-red-500 to-orange-600'
      };
      case 'style': return {
        bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', 
        hoverBorder: 'hover:border-purple-500', button: 'bg-purple-600 hover:bg-purple-500', shadow: 'shadow-purple-500/20',
        gradient: 'from-purple-600 to-pink-600'
      };
      default: return {
        bg: 'bg-brand-blue/10', border: 'border-brand-blue/20', text: 'text-brand-blue', 
        hoverBorder: 'hover:border-brand-blue', button: 'bg-brand-blue hover:bg-blue-500', shadow: 'shadow-blue-500/20',
        gradient: 'from-brand-blue to-cyan-500'
      };
    }
  };

  // Mock Dates for Next 5 Days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for(let i=0; i<5; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            full: d.toISOString()
        });
    }
    return dates;
  };

  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 group">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-gradient-to-tr from-brand-blue/20 to-transparent rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-gradient-to-tl from-brand-purple/20 to-transparent rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-dark-600 text-xs font-bold uppercase tracking-wider text-slate-300 mb-6 shadow-sm">
            <Video className="w-4 h-4 text-brand-blue" />
            Live 1-on-1 Strategy
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Tactical Analysis & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Expert Support</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
             The internet is full of conflicting advice. Skip the noise. Get a customized engineering protocol for your specific hair density, skin chemistry, and lifestyle goals.
          </p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-dark-900/50 px-3 py-1.5 rounded-lg border border-dark-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% Private</span>
             </div>
             <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-dark-900/50 px-3 py-1.5 rounded-lg border border-dark-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Money-back Guarantee</span>
             </div>
          </div>
        </div>
        
        {/* Interactive Visual Element */}
        <div className="relative w-full md:w-1/3 aspect-square max-w-sm hidden md:flex items-center justify-center">
           <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-brand-purple/10 rounded-full blur-2xl"></div>
           {/* Card Stack Effect */}
           <div className="relative w-64 h-80 bg-dark-900 rounded-2xl border border-dark-600 shadow-2xl p-6 flex flex-col rotate-6 translate-x-4 translate-y-4 opacity-50 z-0"></div>
           <div className="relative w-64 h-80 bg-dark-800 rounded-2xl border border-dark-500 shadow-2xl p-6 flex flex-col -rotate-6 z-10 transition-transform hover:rotate-0 duration-500">
              <div className="flex justify-between items-center mb-6 border-b border-dark-600 pb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Next Slot</span>
                  <span className="text-brand-blue font-mono text-xs bg-brand-blue/10 px-2 py-1 rounded">LIVE</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                      <Calendar className="w-10 h-10" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">Today</div>
                  <div className="text-slate-300 font-mono">04:00 PM EST</div>
              </div>
              <button className="w-full mt-auto py-2 bg-white text-dark-900 font-bold rounded-lg text-xs hover:bg-slate-200 transition-colors">
                  Check Availability
              </button>
           </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CONSULTATIONS.map((consult) => {
          const theme = getColorTheme(consult.id);
          return (
            <div key={consult.id} className={`group relative bg-dark-800 rounded-3xl border border-dark-700 ${theme.hoverBorder} transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1`}>
                {/* Gradient Top Border */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`}></div>
                
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3.5 rounded-2xl ${theme.bg} ${theme.border} border`}>
                            <div className={theme.text}>{getIcon(consult.id)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white tracking-tight">${consult.price}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Per Session</div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{consult.title}</h3>
                    <div className="inline-flex mb-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 border border-dark-600 px-2.5 py-1 rounded-md bg-dark-900/50">
                        For: <span className="text-white">{consult.targetAudience}</span>
                        </span>
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-1 border-t border-dashed border-dark-700 pt-4">
                        {consult.description}
                    </p>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center text-sm font-medium text-slate-300">
                            <Clock className="w-4 h-4 mr-3 text-slate-500" />
                            {consult.duration} Zoom Video Call
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-300">
                            <Video className="w-4 h-4 mr-3 text-slate-500" />
                            HD Recording Provided
                        </div>
                    </div>

                    <button 
                        onClick={() => openBooking(consult)}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${theme.button} ${theme.shadow} shadow-lg`}
                    >
                        Initialize Booking <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* Execution Protocol */}
      <div className="bg-dark-900 rounded-3xl border border-dark-700 p-8 md:p-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
                <span className="w-8 h-1 bg-gradient-to-r from-transparent to-brand-blue rounded-full"></span>
                Execution Protocol
                <span className="w-8 h-1 bg-gradient-to-l from-transparent to-brand-blue rounded-full"></span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-dark-700 -z-10"></div>

                {[
                    { step: '01', title: 'Select Vector', desc: 'Choose your consultation type and secure a time slot on the encrypted calendar.' },
                    { step: '02', title: 'Upload Data', desc: 'Securely upload photos of your current hair situation and any inspiration references.' },
                    { step: '03', title: 'Execute', desc: 'Join the private Zoom link. Receive your custom PDF action plan immediately after.' }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 shadow-xl flex items-center justify-center mb-6 relative group-hover:border-brand-blue transition-colors duration-300">
                            <span className="text-xl font-bold text-slate-500 group-hover:text-white transition-colors">{item.step}</span>
                            <div className="absolute -inset-2 bg-brand-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-xs">{item.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {isModalOpen && selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-dark-800 w-full max-w-2xl rounded-2xl border border-dark-600 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-dark-700 bg-dark-900 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {step === 4 ? 'Booking Confirmed' : 'Schedule Session'}
                        </h3>
                        {step < 4 && (
                            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                                {selectedConsultation.title} <span className="w-1 h-1 bg-dark-600 rounded-full"></span> {selectedConsultation.duration}
                            </p>
                        )}
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                {step < 4 && (
                    <div className="h-1 w-full bg-dark-700">
                        <div 
                            className="h-full bg-brand-blue transition-all duration-300 ease-out" 
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                )}
                
                {/* Modal Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* STEP 1: DATE & TIME */}
                    {step === 1 && (
                        <div className="space-y-8">
                            {/* Date Selection */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-brand-blue" /> Select Date
                                </h4>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {generateDates().map((d, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleDateSelect(d.full)}
                                            className={`flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                                selectedDate === d.full 
                                                ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-blue-500/20' 
                                                : 'bg-dark-900 text-slate-300 border-dark-600 hover:border-slate-500 hover:text-white'
                                            }`}
                                        >
                                            <span className="text-xs font-medium uppercase">{d.day}</span>
                                            <span className="text-xl font-bold">{d.date}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-brand-blue" /> Select Time (EST)
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            disabled={!selectedDate}
                                            className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                                                selectedTime === time
                                                ? 'bg-white text-dark-900 border-white'
                                                : !selectedDate 
                                                    ? 'bg-dark-900/50 text-slate-600 border-dark-700 cursor-not-allowed'
                                                    : 'bg-dark-900 text-slate-300 border-dark-600 hover:border-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            type="text" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-blue outline-none"
                                            placeholder="Alex Mercer"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            type="email" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-blue outline-none"
                                            placeholder="alex@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Objective</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
                                    <textarea 
                                        className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-blue outline-none resize-none"
                                        placeholder="Briefly describe your hair system issue or goal (e.g., Adhesive lifting on day 3)..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 flex items-start gap-3">
                                <Lock className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-white font-bold mb-1">Secure Transaction</p>
                                    <p className="text-slate-300 text-xs">
                                        You are booking <span className="text-white">{selectedConsultation.title}</span>. Your card will be charged <span className="text-white font-bold">${selectedConsultation.price}</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            type="text" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-blue outline-none font-mono"
                                            placeholder="0000 0000 0000 0000"
                                            value={paymentData.card}
                                            onChange={(e) => setPaymentData({...paymentData, card: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none font-mono text-center"
                                            placeholder="MM/YY"
                                            value={paymentData.expiry}
                                            onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">CVC / CVV</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white focus:border-brand-blue outline-none font-mono text-center"
                                            placeholder="123"
                                            value={paymentData.cvc}
                                            onChange={(e) => setPaymentData({...paymentData, cvc: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                <Lock className="w-3 h-3" />
                                <span>256-bit SSL Encrypted Payment</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20">
                                <Check className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Protocol Initiated</h3>
                            <p className="text-slate-300 mb-8 max-w-sm mx-auto">
                                Your session has been secured. A confirmation packet with the Zoom link has been sent to <strong>{formData.email}</strong>.
                            </p>
                            
                            <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 max-w-sm mx-auto text-left mb-8">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500 text-xs uppercase font-bold">Service</span>
                                    <span className="text-white text-sm font-bold">{selectedConsultation.title}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500 text-xs uppercase font-bold">Time</span>
                                    <span className="text-white text-sm">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between border-t border-dark-700 pt-2 mt-2">
                                    <span className="text-slate-500 text-xs uppercase font-bold">Paid</span>
                                    <span className="text-green-500 text-sm font-bold">${selectedConsultation.price}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                
                {/* Modal Footer */}
                {step < 4 && (
                    <div className="p-6 border-t border-dark-700 bg-dark-900 flex justify-end gap-3">
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-dark-800 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button 
                            onClick={handleNextStep}
                            disabled={
                                (step === 1 && (!selectedDate || !selectedTime)) || 
                                (step === 2 && (!formData.name || !formData.email)) ||
                                (step === 3 && (!paymentData.card || !paymentData.expiry || !paymentData.cvc))
                            }
                            className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {step === 3 ? 'Pay & Book' : step === 1 ? 'Continue' : 'Continue'} 
                            {step < 3 && <ChevronRight className="w-4 h-4" />}
                            {step === 3 && <Lock className="w-4 h-4" />}
                        </button>
                    </div>
                )}
                {step === 4 && (
                    <div className="p-6 border-t border-dark-700 bg-dark-900 flex justify-center">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="w-full px-8 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-colors border border-dark-600"
                        >
                            Close Interface
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
};
