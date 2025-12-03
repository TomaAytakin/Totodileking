import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCcw, Wifi, Battery, Calculator, Coins, TrendingUp, Twitter, Clock, Volume2, VolumeX, Copy, Check, Github, ExternalLink } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';

// Constants
const CARD_PRICE_API_URL = 'https://get-totodile-price-155030518828.europe-west1.run.app';
const TOKEN_ADDRESS = 'E23qZatCvTpnxbwYuKQ7ZeGNwdiPe2cKzdojPjDpump';
const TREASURY_WALLET_ADDRESS = '3xsMLdAWXGSRUExnktqsW1UaNurq19ceQGUY5NeWrsk6';
const SOLANA_RPC_URL = 'https://solana-rpc.publicnode.com';

const TOKEN_API_URL = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;

function App() {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [treasuryValue, setTreasuryValue] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [cardUrl, setCardUrl] = useState('https://www.cardmarket.com/en/Pokemon/Products/Singles/Neo-Genesis/Totodile-V2-NG81');
  const audioRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Card Price
      const cardPriceResponse = await fetch(CARD_PRICE_API_URL);
      const cardPriceData = await cardPriceResponse.json();

      let cardPrice = 55.50; // Fallback

      // Upgrade: Handle new JSON structure { price, trendPrice, isLowPrice, url }
      if (cardPriceData.price) {
         cardPrice = cardPriceData.price;
      } else if (cardPriceData.averageSellPrice) {
         cardPrice = cardPriceData.averageSellPrice;
      } else if (typeof cardPriceData === 'number') {
         cardPrice = cardPriceData;
      }

      if (cardPriceData.url) {
          setCardUrl(cardPriceData.url);
      }

      // 2. Fetch Token Price from Dexscreener
      const tokenResponse = await fetch(TOKEN_API_URL);
      const tokenData = await tokenResponse.json();
      let currentTokenPrice = 0;

      if (tokenData.pairs && tokenData.pairs.length > 0) {
        currentTokenPrice = parseFloat(tokenData.pairs[0].priceUsd);
        setTokenPrice(currentTokenPrice);
      }

      // 3. Fetch Live Token Balance from Solana
      const connection = new Connection(SOLANA_RPC_URL);
      const treasuryPublicKey = new PublicKey(TREASURY_WALLET_ADDRESS);
      const tokenMintPublicKey = new PublicKey(TOKEN_ADDRESS);

      const accounts = await connection.getParsedTokenAccountsByOwner(
        treasuryPublicKey,
        { mint: tokenMintPublicKey }
      );

      console.log('Mint:', TOKEN_ADDRESS, 'Found accounts:', accounts.value.length);

      let balance = 0;
      if (accounts.value.length > 0) {
        balance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      }
      setTokenBalance(balance);

      // 4. Calculate Treasury Value and Buying Power
      const tValue = currentTokenPrice * balance;
      setTreasuryValue(tValue);

      const bPower = tValue / cardPrice;
      setBuyingPower(bPower);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
        if (!isMuted) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("Autoplay blocked:", e));
            }
        } else {
            audioRef.current.pause();
        }
    }
  }, [isMuted]);

  // Format countdown as MM:SS (though it's only 60s max, so 00:XX)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 gap-8">
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
          <div className="bg-[#9ca04c] border-4 border-gray-500 rounded p-4 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[16rem]">
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>

            <div className="flex justify-between items-center z-10 text-gray-800 border-b border-gray-700 pb-1 mb-2">
              <span className="flex items-center gap-1 font-bold text-xs"><Wifi size={14} /> ONLINE</span>
              <span className="flex items-center gap-1 font-bold text-xs"><Battery size={14} /> 100%</span>
            </div>

            {/* Pokemon Card Image */}
            <div className="flex justify-center z-10 mb-2">
                <img src="/totodile-card.png" alt="Totodile Card" className="h-32 object-contain drop-shadow-md border-2 border-gray-600 rounded" />
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
                      <Coins size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">BALANCE:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">{tokenBalance.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-600 pb-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">TREASURY:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">${treasuryValue.toFixed(2)}</span>
                  </div>

                  {/* Wallet Link */}
                  <div className="flex justify-between items-center border-b border-gray-600 pb-1">
                    <div className="flex items-center gap-2">
                      {/* Using a generic icon or we could import Wallet if available. Using TrendingUp or generic circle for now, or just text.
                          The user requested "Wallet Link: Make the TREASURY_WALLET_ADDRESS text clickable".
                          I'll mimic the CA layout.
                      */}
                      <span className="font-bold text-sm text-gray-800">WALLET:</span>
                    </div>
                    <a
                      href={`https://solscan.io/account/${TREASURY_WALLET_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-sm text-gray-900 flex items-center gap-1 hover:text-blue-600"
                    >
                      {`${TREASURY_WALLET_ADDRESS.slice(0, 4)}...${TREASURY_WALLET_ADDRESS.slice(-4)}`}
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-600 pb-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={copyToClipboard}
                          className="hover:text-gray-600 transition-colors"
                          title="Copy Address"
                        >
                          {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-800" />}
                        </button>
                      </div>
                      <span className="font-bold text-sm text-gray-800">CA:</span>
                    </div>
                    <span className="font-mono font-bold text-sm text-gray-900 flex items-center gap-1">
                      {`${TOKEN_ADDRESS.slice(0, 4)}...${TOKEN_ADDRESS.slice(-4)}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calculator size={18} className="text-gray-800" />
                      <span className="font-bold text-sm text-gray-800">POWER:</span>
                    </div>
                    <span className="font-mono font-bold text-lg text-gray-900">{buyingPower.toFixed(2)} CARDS</span>
                  </div>

                  {/* Price Source Link */}
                  <div className="text-center mt-1">
                     <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-blue-600 flex items-center justify-center gap-1 font-bold">
                        Source: PriceCharting <ExternalLink size={10} />
                     </a>
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

        {/* Footer Info - Updated Subheading */}
        <div className="mb-6 flex justify-center">
             <div className="bg-gray-800 rounded-lg p-3 text-white text-xs shadow-lg border border-gray-700 text-center">
                We the cryptobros gotchu bro
                <a href="https://x.com/totodile_king" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold ml-1">
                    @totodile_king
                    <Twitter size={14} fill="currentColor" />
                </a>
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
            <div className="flex gap-4 justify-end">
               {/* Sound Toggle */}
               <button
                 onClick={() => setIsMuted(!isMuted)}
                 className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 shadow-md active:shadow-inner active:bg-gray-900 border-2 border-gray-700"
               >
                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
               </button>
            </div>

            <div className="flex gap-4">
               <div className="w-12 h-3 bg-gray-800 rounded-full rotate-[-25deg] shadow-md"></div>
               <div className="w-12 h-3 bg-gray-800 rounded-full rotate-[-25deg] shadow-md"></div>
            </div>

            {/* Countdown Timer Display */}
            <div className="bg-black/80 text-green-500 font-mono py-2 px-4 rounded-lg shadow-inner border border-gray-700 flex items-center gap-2 text-sm">
                <Clock size={16} className="text-green-500 animate-pulse" />
                <span>NEXT UPDATE:</span>
                <span className="font-bold">{formatTime(countdown)}</span>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex gap-4">
          <a href="https://x.com/i/communities/1996002744012845255" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
             <Twitter size={20} />
             <span className="font-bold">Join the Community</span>
          </a>
          <a href="https://github.com/TomaAytakin/Totodileking" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
             <Github size={20} />
             <span className="font-bold">Source Code</span>
          </a>
      </div>

      <audio ref={audioRef} src="/bg-music.mp3" loop />
    </div>
  );
}

export default App;
