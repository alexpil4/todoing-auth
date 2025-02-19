'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type Props = {
  is2FAActivated: boolean;
};

export default function TwoFactorAuthForm({ is2FAActivated }: Props) {
  const [isActivated, setIsActivated] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setIsActivated(is2FAActivated);
  }, [is2FAActivated]);

  const handleEnable2FA = () => {
    setStep(2);
  };

  return (
    <>
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button className="uppercase" onClick={handleEnable2FA}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && <div>show QR code</div>}
        </div>
      )}
    </>
  );
}
