"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FeClientInvoiceView } from '@/modules/17-fees/ui/FeClientInvoiceView';
import { AlertCircle, Loader2 } from 'lucide-react';

interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  grossAmount: number;
  adjustments: number;
  netAmount: number;
  currency: string;
  status: 'sent' | 'paid' | 'overdue';
  paidAmount: number;
  paidDate: string | null;
  lineItemsJson: string;
}

// This is a public-facing page for clients to view their invoices
// In production, the token would be validated server-side
export default function ShareInvoicePage() {
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<FeeInvoice | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // In production, this would validate the token and fetch the invoice
        // For demo, we'll just show a sample invoice or error based on token format

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo: Accept any token that looks like an invoice ID
        if (token && token.startsWith('finv-')) {
          // Fetch the actual invoice for demo purposes
          const res = await fetch(`/api/collections/feeInvoices/${token}`);
          if (res.ok) {
            const data = await res.json();
            const inv = data.item || data;
            // Only show sent, paid, or overdue invoices to clients
            if (inv && ['sent', 'paid', 'overdue'].includes(inv.status)) {
              setInvoice(inv);
            } else {
              setError('This invoice is not available for viewing.');
            }
          } else {
            setError('Invoice not found or access denied.');
          }
        } else {
          setError('Invalid or expired link.');
        }
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
        setError('An error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Unable to Load Invoice</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <p className="text-sm text-stone-500">
            If you believe this is an error, please contact your account manager.
          </p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <FeClientInvoiceView
        invoice={invoice}
        companyName="WealthOS Advisory"
        companyAddress="123 Financial District\nNew York, NY 10005\nUSA"
        clientName="Valued Client"
        bankDetails={{
          bankName: "JP Morgan Chase",
          accountNumber: "****1234",
          routingNumber: "021000021",
          swiftCode: "CHASUS33",
        }}
        onDownloadPdf={() => {
          console.log('Download PDF');
          alert('PDF download would be triggered here');
        }}
        onPayNow={() => {
          console.log('Pay now');
          alert('Payment portal would open here');
        }}
      />
    </div>
  );
}
