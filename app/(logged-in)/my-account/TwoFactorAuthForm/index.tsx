'use client';

import { Button } from '@/components/ui/button';
import { FormEvent, useEffect, useState } from 'react';
import { activate2FA, get2FASecret } from './action';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

type Props = {
  is2FAActivated: boolean;
};

export default function TwoFactorAuthForm({ is2FAActivated }: Props) {
  const { toast } = useToast();

  const [isActivated, setIsActivated] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');

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

  const handleDisable2FA = async () => {
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

  const handleOTPTyping = (value: string) => {
    setOtp(value);
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await activate2FA(otp);

    if (response?.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      });
      return;
    }

    toast({
      title: 'Two-Factor Authentication has been enabled',
    });

    setIsActivated(true);
  };

  return (
    <div className="mt-4">
      {isActivated ? (
        <Button className="uppercase" variant="destructive" onClick={handleDisable2FA}>
          Disable Two-Factor Authentication
        </Button>
      ) : (
        <>
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
                Back
              </Button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground py-4">
                Please enter the one-time passcode from the Google Authenticator app:
              </p>
              <InputOTP maxLength={6} value={otp} onChange={handleOTPTyping}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit" className="uppercase mt-8 w-full">
                Activate 2FA
              </Button>
              <Button
                className="uppercase w-full mt-4"
                variant="outline"
                onClick={() => goToStep(2)}
              >
                Back
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
