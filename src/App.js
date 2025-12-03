import React, { useState, useEffect } from 'react';
import { RefreshCcw, Wifi, Battery, Calculator, Coins, TrendingUp } from 'lucide-react';

// Use a local constant for card price for now
const LOCAL_CARD_PRICE = 55.50;
const TOKEN_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/E23qZatCvTpnxbwYuKQ7ZeGNwdiPe2cKzdojPjDpump';

function App() {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [treasuryValue, setTreasuryValue] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(TOKEN_API_URL);
      const data = await response.json();

      if (data.pairs && data.pairs.length > 0) {
        const price = parseFloat(data.pairs[0].priceUsd);
        setTokenPrice(price);

        const tValue = price * 1000000;
        setTreasuryValue(tValue);

        const bPower = tValue / LOCAL_CARD_PRICE;
        setBuyingPower(bPower);
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {/* Pokedex / Gameboy Container */}
      <div className="relative w-full max-w-md bg-red-600 rounded-b-xl rounded-t-lg shadow-2xl p-6 border-b-8 border-r-8 border-red-800">

        {/* Top Header Section */}
        <div className="flex items-center justify-between mb-6 border-b-4 border-red-800 pb-2">
           <div className="flex space-x-2">
             <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-lg animate-pulse"></div>
             <div className="w-3 h-3 rounded-full bg-red-800"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <h1 className="text-white font-bold text-xl tracking-wider uppercase drop-shadow-md">Totodex</h1>
        </div>

        {/* Screen Container */}
        <div className="bg-gray-300 rounded-lg p-6 mb-6 shadow-inner border-4 border-gray-400 relative overflow-hidden">

          {/* Main Screen */}
          <div className="bg-[#9ca04c] border-4 border-gray-500 rounded p-4 shadow-inner relative overflow-hidden h-64 flex flex-col justify-between">
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>

            <div className="flex justify-between items-center z-10 text-gray-800 border-b border-gray-700 pb-1 mb-2">
              <span className="flex items-center gap-1 font-bold text-xs"><Wifi size={14} /> ONLINE</span>
              <span className="flex items-center gap-1 font-bold text-xs"><Battery size={14} /> 100%</span>
            </div>

            <div className="z-10 flex-1 flex flex-col justify-center space-y-4">
              {loading ? (
                 <div className="text-center font-bold animate-pulse text-gray-800">SCANNING...</div>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-gray-600 pb-1">
                    <div className="flex items-center gap-2">
                      <Coins size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">PRICE:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">${tokenPrice ? tokenPrice.toFixed(8) : '0.00'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-600 pb-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">TREASURY:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">${treasuryValue.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calculator size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">POWER:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">{buyingPower.toFixed(2)} CARDS</span>
                  </div>

                  <div className="text-center mt-2 text-xs font-bold text-gray-700">
                    Ref: Totodile (Neo Genesis)
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
             <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
             <div className="flex space-x-2">
               <div className="w-8 h-1 bg-gray-500 rounded"></div>
               <div className="w-8 h-1 bg-gray-500 rounded"></div>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-end px-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
               <div className="w-8 h-24 bg-gray-900 absolute rounded"></div>
               <div className="w-24 h-8 bg-gray-900 absolute rounded"></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
               <div className="w-12 h-3 bg-gray-800 rounded-full rotate-[-25deg] shadow-md"></div>
               <div className="w-12 h-3 bg-gray-800 rounded-full rotate-[-25deg] shadow-md"></div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 text-sm"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> REFRESH
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
