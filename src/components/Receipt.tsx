import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ReceiptData, ReceiptOptions } from '../types/receipt';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
interface ReceiptProps {
  data: ReceiptData;
  options: ReceiptOptions;
}

export const Receipt: React.FC<ReceiptProps> = ({ data, options }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options.includeQR && qrRef.current) {
      // Create comprehensive receipt data for QR code
      const receiptInfo = {
        storeName: data.storeName,
        storeAddress: data.storeAddress,
        storePhone: data.storePhone,
        storeEmail: data.storeEmail,
        date: data.date,
        transactionId: data.transactionId,
        cashier: data.cashier,
        paymentMethod: data.paymentMethod,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        vat: data.tax,
        total: data.total,
        footerMessage: data.footerMessage,
        terms: data.terms,
        style: data.style
      };
      
      const qrText = JSON.stringify(receiptInfo);
      
      QRCode.toCanvas(qrText, { width: 256, margin: 2, errorCorrectionLevel: 'M' })
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
      tech: "⚡ ELECTRONICS & TECH",
      restaurant: "🍽️ RESTAURANT & DINING",
      retail: "🛍️ RETAIL STORE",
      corporate: "🏢 CORPORATE",
      thermal: "📄 THERMAL RECEIPT",
      modern: "✨ MODERN RECEIPT"
    };

    return brandMap[data.style] || "🏪 STORE";
  };

  return (
    <div className={getReceiptStyle()}>
      {/* Header */}
      {options.includeLogo && (
        <div className={getHeaderStyle()}>
          <div className="text-xs text-muted-foreground mb-1">{getBrandHeader()}</div>
          <div className="text-sm font-bold">{data.storeName || 'Store Name'}</div>
        </div>
      )}

      {/* Store Info */}
      <div className="text-center mb-3">
        {!options.includeLogo && <div className="font-bold text-sm mb-1">{data.storeName || 'Store Name'}</div>}
        <div className="text-xs leading-relaxed">
          {data.storeAddress && <div>{data.storeAddress}</div>}
          {options.includeContact && (
            <>
              {data.storePhone && <div>{data.storePhone}</div>}
              {data.storeEmail && <div>{data.storeEmail}</div>}
            </>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Transaction Info */}
      <div className="text-xs mb-3 space-y-1">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{data.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Transaction:</span>
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
          <div className="space-y-1 mb-3">
            {data.items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="flex-1 truncate pr-2">{item.name}</span>
                <span className="whitespace-nowrap">${item.price}</span>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
        </>
      )}

      {/* Totals */}
      <div className="space-y-1 text-xs">
        {data.subtotal && (
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${data.subtotal}</span>
          </div>
        )}
        {data.tax && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${data.tax}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t pt-1">
          <span>Total:</span>
          <span>${data.total || '0.00'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Payment:</span>
          <span>{data.paymentMethod}</span>
        </div>
      </div>

      {/* Footer */}
      {data.footerMessage && (
        <>
          <Separator className="my-3" />
          <div className="text-center text-xs font-medium">
            {data.footerMessage}
          </div>
        </>
      )}

      {/* Terms */}
      {options.includeTerms && data.terms && (
        <>
          <Separator className="my-2" />
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Terms & Conditions:</div>
            <div className="leading-relaxed">{data.terms}</div>
          </div>
        </>
      )}

      {/* QR Code */}
      {options.includeQR && (
        <>
          <Separator className="my-3" />
          <div className="flex justify-center">
            <div ref={qrRef} className="text-center" data-qr-container />
          </div>
        </>
      )}

      {/* Design-specific footer elements */}
      {data.style === 'thermal' && (
        <div className="text-center text-xs mt-3 border-t border-dashed pt-2">
          - THERMAL RECEIPT -
        </div>
      )}
      
      {data.style === 'corporate' && (
        <div className="text-center text-xs mt-3 border-t-2 border-gray-800 pt-2 font-bold">
          CORPORATE RECEIPT
        </div>
      )}
    </div>
  );
};