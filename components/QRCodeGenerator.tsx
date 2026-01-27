'use client';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';

interface QRCodeGeneratorProps  {
    address: string,
    size?: number
}

const QRCodeGenerator:FC<QRCodeGeneratorProps> = ({ address, size = 256 }) => {
  // Create a URI for different wallet types

  return (
    <div>
      <QRCodeCanvas value={address} size={size} />
    </div>
  );
};

export default QRCodeGenerator;