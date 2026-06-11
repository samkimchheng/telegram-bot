'use client';

// Let's reuse the existing QrStationPage by importing it from the dashboard module, 
// or recreate it here. For simplicity, we can just use the same component logic.
import QrStationContent from '@/app/dashboard/qr-station/page';

export default function AdminQrPage() {
  return <QrStationContent />;
}
