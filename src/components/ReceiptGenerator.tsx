import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Receipt } from './Receipt';
import { ReceiptData, ReceiptStyle } from '../types/receipt';
import { Printer, Download, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdf-generator';
import { toast } from '@/hooks/use-toast';

const receiptStyles: { value: ReceiptStyle; label: string }[] = [
  { value: 'modern', label: 'Modern Clean' },
  { value: 'thermal', label: 'Thermal Printer' },
  { value: 'corporate', label: 'Corporate Business' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'gas', label: 'Gas Station' },
  { value: 'coffee', label: 'Coffee Shop' },
  { value: 'tech', label: 'Electronics Store' }
];

export const ReceiptGenerator: React.FC = () => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    date: new Date().toLocaleString(),
    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    items: [],
    subtotal: '',
    tax: '',
    total: '',
    paymentMethod: 'Cash',
    cashier: '',
    footerMessage: 'Thank you for your business!',
    terms: '',
    style: 'modern'
  });

  const [options, setOptions] = useState({
    includeQR: true,
    includeTerms: false,
    includeContact: true,
    includeLogo: true
  });

  const [itemInput, setItemInput] = useState('');

  const updateField = (field: keyof ReceiptData, value: string) => {
    setReceiptData(prev => ({ ...prev, [field]: value }));
  };

  const addItems = () => {
    if (itemInput.trim()) {
      const items = itemInput.split('\n').filter(line => line.trim());
      const newItems = items.map(item => {
        const parts = item.split('-');
        return {
          name: parts[0]?.trim() || '',
          price: parts[1]?.trim() || '0.00',
          quantity: 1
        };
      });
      setReceiptData(prev => ({ ...prev, items: [...prev.items, ...newItems] }));
      setItemInput('');
    }
  };

  const removeItem = (index: number) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=400,height=800');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                @media print {
                  body { margin: 0; padding: 0; }
                  .receipt-container { width: 80mm; max-width: 80mm; margin: 0; }
                }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                ${receiptRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        
        toast({
          title: "Printing Receipt",
          description: "Receipt sent to printer",
        });
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (receiptRef.current) {
      try {
        await generatePDF(receiptRef.current, `receipt-${receiptData.transactionId}.pdf`);
        toast({
          title: "PDF Downloaded",
          description: "Receipt saved as PDF",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate PDF",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Receipt Generator Pro
          </h1>
          <p className="text-muted-foreground">Create professional receipts with multiple styles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="receipt-paper">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Receipt Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Information */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Store Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={receiptData.storeName}
                      onChange={(e) => updateField('storeName', e.target.value)}
                      placeholder="My Store"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input
                      id="storeAddress"
                      value={receiptData.storeAddress}
                      onChange={(e) => updateField('storeAddress', e.target.value)}
                      placeholder="123 Main St, City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storePhone">Phone</Label>
                    <Input
                      id="storePhone"
                      value={receiptData.storePhone}
                      onChange={(e) => updateField('storePhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">Email</Label>
                    <Input
                      id="storeEmail"
                      value={receiptData.storeEmail}
                      onChange={(e) => updateField('storeEmail', e.target.value)}
                      placeholder="store@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Transaction Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date & Time</Label>
                    <Input
                      id="date"
                      value={receiptData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      value={receiptData.transactionId}
                      onChange={(e) => updateField('transactionId', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashier">Cashier</Label>
                    <Input
                      id="cashier"
                      value={receiptData.cashier}
                      onChange={(e) => updateField('cashier', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={receiptData.paymentMethod} onValueChange={(value) => updateField('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Items</Label>
                <div className="space-y-2">
                  <Textarea
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    placeholder="Enter items (one per line): Item Name - Price&#10;Example: Coffee - 4.50"
                    rows={3}
                  />
                  <Button onClick={addItems} variant="outline" size="sm">
                    Add Items
                  </Button>
                </div>
                
                {receiptData.items.length > 0 && (
                  <div className="space-y-2">
                    {receiptData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{item.name} - ${item.price}</span>
                        <Button onClick={() => removeItem(index)} variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Totals</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input
                      id="subtotal"
                      value={receiptData.subtotal}
                      onChange={(e) => updateField('subtotal', e.target.value)}
                      placeholder="10.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax">Tax</Label>
                    <Input
                      id="tax"
                      value={receiptData.tax}
                      onChange={(e) => updateField('tax', e.target.value)}
                      placeholder="0.80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total">Total</Label>
                    <Input
                      id="total"
                      value={receiptData.total}
                      onChange={(e) => updateField('total', e.target.value)}
                      placeholder="10.80"
                    />
                  </div>
                </div>
              </div>

              {/* Style and Options */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Style & Options</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="style">Receipt Style</Label>
                    <Select value={receiptData.style} onValueChange={(value: ReceiptStyle) => updateField('style', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {receiptStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeQR"
                        checked={options.includeQR}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeQR: !!checked }))}
                      />
                      <Label htmlFor="includeQR">Include QR Code</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeTerms"
                        checked={options.includeTerms}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeTerms: !!checked }))}
                      />
                      <Label htmlFor="includeTerms">Include Terms</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeContact"
                        checked={options.includeContact}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeContact: !!checked }))}
                      />
                      <Label htmlFor="includeContact">Include Contact Info</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeLogo"
                        checked={options.includeLogo}
                        onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeLogo: !!checked }))}
                      />
                      <Label htmlFor="includeLogo">Include Logo</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="footerMessage">Footer Message</Label>
                  <Textarea
                    id="footerMessage"
                    value={receiptData.footerMessage}
                    onChange={(e) => updateField('footerMessage', e.target.value)}
                    placeholder="Thank you for your business!"
                    rows={2}
                  />
                </div>
                {options.includeTerms && (
                  <div>
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                      id="terms"
                      value={receiptData.terms}
                      onChange={(e) => updateField('terms', e.target.value)}
                      placeholder="All sales final. Returns within 30 days."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handlePrint} className="flex-1" variant="default">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={handleDownloadPDF} className="flex-1" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          <div className="receipt-preview">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={receiptRef}>
                  <Receipt data={receiptData} options={options} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};