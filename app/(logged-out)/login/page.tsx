'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordSchema } from '@/validation/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginWithCredential, preLoginCheck } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleOTPTyping = (value: string) => {
    setOtp(value);
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginWithCredential({
      email: form.getValues('email'),
      password: form.getValues('password'),
      token: otp,
    });

    if (response?.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      });
      return;
    } else {
      router.push('/my-account');
    }
  };

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    const preLoginResponse = await preLoginCheck(data);

    if (preLoginResponse?.error) {
      form.setError('root', { message: preLoginResponse.message });
      return;
    }

    if (preLoginResponse.twoFactorAuthActivated) {
      setStep(2);
    } else {
      const response = await loginWithCredential(data);

      if (response?.error) {
        form.setError('root', { message: response.message });
      } else {
        router.push('/my-account');
      }
    }
  };

  const email = form.getValues('email');

  return (
    <main className="flex justify-center items-center min-h-screen">
      {step == 1 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-1xl uppercase">WELCOME TODOING!</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleValidatedSubmit)}
                className="flex flex-col gap-2"
              >
                <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root?.message && (
                    <FormMessage>{form.formState.errors.root.message}</FormMessage>
                  )}
                  <Button className="mt-8 uppercase" type="submit">
                    Login
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm text-muted-foreground">
              <p>
                Do not have an account yet?{' '}
                <Link href="/register" className="underline">
                  Register
                </Link>
              </p>
              <p>
                Forgot the password?{' '}
                <Link
                  href={`/password-reset${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="underline"
                >
                  Reset my password
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
      {step === 2 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription className="text-xs text-muted-foreground py-4">
              Enter the one-time passcode for Todoing displayed into your Google Authenticator app:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
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
                VERIFY OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
