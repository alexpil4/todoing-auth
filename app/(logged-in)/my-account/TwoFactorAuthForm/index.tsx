'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { get2FASecret } from './action';
import { useToast } from '@/hooks/use-toast';

type Props = {
  is2FAActivated: boolean;
};

export default function TwoFactorAuthForm({ is2FAActivated }: Props) {
  const { toast } = useToast;

  const [isActivated, setIsActivated] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setIsActivated(is2FAActivated);
  }, [is2FAActivated]);

  const handleEnable2FA = async () => {
    setStep(2);
    const response = await get2FASecret();

    if (response.error) {
    }
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
