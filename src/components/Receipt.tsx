import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ReceiptData, ReceiptOptions } from '../types/receipt';
import { Separator } from '@/components/ui/separator';

interface ReceiptProps {
  data: ReceiptData;
  options: ReceiptOptions;
}

export const Receipt: React.FC<ReceiptProps> = ({ data, options }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options.includeQR && qrRef.current) {
      const qrText = `${data.storeName}\n${data.storeAddress}\n${data.date}\nTransaction: ${data.transactionId}\nTotal: $${data.total}`;
      
      QRCode.toCanvas(qrText, { width: 80, margin: 1 })
        .then((canvas) => {
          if (qrRef.current) {
            qrRef.current.innerHTML = '';
            qrRef.current.appendChild(canvas);
          }
        })
        .catch(console.error);
    }
  }, [data, options.includeQR]);

  const getReceiptStyle = () => {
    const baseClasses = "receipt-container bg-white text-black w-[80mm] min-h-[200px] mx-auto p-4 text-xs leading-tight";
    
    switch (data.style) {
      case 'thermal':
        return `${baseClasses} receipt-thermal font-mono border border-gray-300`;
      case 'modern':
        return `${baseClasses} receipt-modern font-sans rounded-lg shadow-receipt`;
      case 'corporate':
        return `${baseClasses} font-sans border-2 border-gray-800`;
      case 'retail':
        return `${baseClasses} font-sans border border-gray-400`;
      case 'restaurant':
        return `${baseClasses} font-serif border border-gray-600`;
      case 'pharmacy':
        return `${baseClasses} font-sans border-2 border-blue-500 bg-blue-50`;
      case 'grocery':
        return `${baseClasses} font-sans border border-green-500 bg-green-50`;
      case 'gas':
        return `${baseClasses} font-mono border-2 border-yellow-500 bg-yellow-50`;
      case 'coffee':
        return `${baseClasses} font-sans border-2 border-amber-600 bg-amber-50`;
      case 'tech':
        return `${baseClasses} font-sans border-2 border-purple-500 bg-purple-50`;
      default:
        return `${baseClasses} receipt-modern`;
    }
  };

  const getHeaderStyle = () => {
    switch (data.style) {
      case 'pharmacy':
        return "text-center font-bold text-blue-800 text-sm mb-2 pb-2 border-b-2 border-blue-500";
      case 'grocery':
        return "text-center font-bold text-green-800 text-sm mb-2 pb-2 border-b-2 border-green-500";
      case 'gas':
        return "text-center font-bold text-yellow-800 text-sm mb-2 pb-2 border-b-2 border-yellow-500 bg-yellow-200 -mx-4 px-4";
      case 'coffee':
        return "text-center font-bold text-amber-800 text-sm mb-2 pb-2 border-b-2 border-amber-600 bg-amber-200 -mx-4 px-4";
      case 'tech':
        return "text-center font-bold text-purple-800 text-sm mb-2 pb-2 border-b-2 border-purple-500 bg-purple-200 -mx-4 px-4";
      case 'restaurant':
        return "text-center font-bold text-gray-800 text-base mb-2 pb-2 border-b-2 border-gray-800";
      case 'corporate':
        return "text-center font-bold text-gray-900 text-sm mb-2 pb-2 border-b-2 border-gray-800";
      default:
        return "text-center font-bold text-gray-900 text-sm mb-2";
    }
  };

  const getBrandHeader = () => {
    if (!options.includeLogo || !data.storeName) return null;

    const brandMap: Record<string, string> = {
      pharmacy: "🏥 PHARMACY & MEDICAL",
      grocery: "🛒 FRESH GROCERIES",
      gas: "⛽ FUEL & CONVENIENCE",
      coffee: "☕ ARTISAN COFFEE",
      tech: "📱 ELECTRONICS & TECH",
      restaurant: "🍽️ FINE DINING",
    };

    return (
      <div className={getHeaderStyle()}>
        <div className="text-lg font-black">{data.storeName}</div>
        {brandMap[data.style] && (
          <div className="text-xs mt-1">{brandMap[data.style]}</div>
        )}
      </div>
    );
  };

  return (
    <div className={getReceiptStyle()}>
      {getBrandHeader()}
      
      {/* Store Information */}
      <div className="text-center mb-3">
        {!options.includeLogo && data.storeName && (
          <div className="font-bold text-sm mb-1">{data.storeName}</div>
        )}
        {data.storeAddress && <div className="text-xs">{data.storeAddress}</div>}
        {options.includeContact && (
          <>
            {data.storePhone && <div className="text-xs">{data.storePhone}</div>}
            {data.storeEmail && <div className="text-xs">{data.storeEmail}</div>}
          </>
        )}
      </div>

      <Separator className="my-2" />

      {/* Transaction Details */}
      <div className="mb-3 space-y-1">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{data.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Transaction ID:</span>
          <span>{data.transactionId}</span>
        </div>
        {data.cashier && (
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{data.cashier}</span>
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Items */}
      {data.items.length > 0 && (
        <>
          <div className="mb-3">
            {data.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-1">
                <div className="flex-1 pr-2">
                  <div className="font-medium">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                  )}
                </div>
                <div className="font-mono">${item.price}</div>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
        </>
      )}

      {/* Totals */}
      <div className="mb-3 space-y-1">
        {data.subtotal && (
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-mono">${data.subtotal}</span>
          </div>
        )}
        {data.tax && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-mono">${data.tax}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t pt-1">
          <span>TOTAL:</span>
          <span className="font-mono">${data.total || '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment:</span>
          <span>{data.paymentMethod}</span>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Footer Message */}
      {data.footerMessage && (
        <div className="text-center mb-3 text-xs">
          {data.footerMessage}
        </div>
      )}

      {/* Terms & Conditions */}
      {options.includeTerms && data.terms && (
        <div className="text-xs text-gray-600 mb-3 border-t pt-2">
          <div className="font-semibold mb-1">Terms & Conditions:</div>
          <div>{data.terms}</div>
        </div>
      )}

      {/* QR Code */}
      {options.includeQR && (
        <div className="text-center mt-3">
          <div ref={qrRef} className="inline-block" />
          <div className="text-xs mt-1 text-gray-600">Scan for details</div>
        </div>
      )}

      {/* Style-specific footer */}
      {data.style === 'thermal' && (
        <div className="text-center text-xs mt-3 border-t pt-2 border-dashed">
          ** CUSTOMER COPY **
        </div>
      )}
    </div>
  );
};