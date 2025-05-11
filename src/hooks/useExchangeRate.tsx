
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Cache exchange rate for 1 hour to avoid excessive API calls
interface CachedRate {
  rate: number;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const FALLBACK_RATE = 38.76; // Fallback exchange rate if API fails

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      // Check if we have a cached rate that's still valid
      const cachedData = localStorage.getItem('exchangeRateCache');
      if (cachedData) {
        const cached: CachedRate = JSON.parse(cachedData);
        const now = Date.now();
        
        if (now - cached.timestamp < CACHE_DURATION) {
          setExchangeRate(cached.rate);
          setIsLoading(false);
          return;
        }
      }
      
      try {
        // Using ExchangeRate-API's free tier
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates && data.rates.TRY) {
          const newRate = data.rates.TRY;
          
          // Cache the new rate
          const cacheData: CachedRate = {
            rate: newRate,
            timestamp: Date.now()
          };
          localStorage.setItem('exchangeRateCache', JSON.stringify(cacheData));
          
          setExchangeRate(newRate);
          
          // Update the rate in localStorage for consistency
          localStorage.setItem('currentExchangeRate', newRate.toString());
          
          // Notify other components about the updated rate
          window.dispatchEvent(new Event('exchangeRateUpdated'));
        } else {
          throw new Error("Could not find TRY rate in response");
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        toast({
          title: "Exchange Rate Update Failed",
          description: "Using fallback exchange rate. Will try again later.",
          variant: "destructive"
        });
        
        // Use fallback rate
        setExchangeRate(FALLBACK_RATE);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExchangeRate();
    
    // Set up periodic refresh (every hour)
    const intervalId = setInterval(fetchExchangeRate, CACHE_DURATION);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  return { exchangeRate, isLoading };
};
