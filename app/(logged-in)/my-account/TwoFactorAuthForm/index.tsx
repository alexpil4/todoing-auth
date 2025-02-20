'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { get2FASecret } from './action';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  is2FAActivated: boolean;
};

export default function TwoFactorAuthForm({ is2FAActivated }: Props) {
  const { toast } = useToast();

  const [isActivated, setIsActivated] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  useEffect(() => {
    setIsActivated(is2FAActivated);
  }, [is2FAActivated]);

  const handleEnable2FA = async () => {
    const response = await get2FASecret();

    if (response.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      });
      return;
    }
    setStep(2);
    setCode(response.twoFactorSecret ?? '');
  };

  const goToStep = (step: number) => {
    setStep(step);
  };

  return (
    <>
      {!isActivated && (
        <div className="mt-4">
          {step === 1 && (
            <Button className="uppercase" onClick={handleEnable2FA}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs text-muted-foreground py-4">
                Scan the QR code below in the Goggle Authenticator app to activate Two-Factor
                Authentication.
              </p>
              <QRCodeSVG className="w-full" value={code} />
              <Button onClick={() => goToStep(3)} className="uppercase mt-8 w-full">
                I have scanned the QR code
              </Button>
              <Button
                className="uppercase w-full mt-4"
                variant="outline"
                onClick={() => goToStep(1)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
