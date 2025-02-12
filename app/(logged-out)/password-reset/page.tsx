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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { passwordReset } from './actions';

// Form schema
const formSchema = z.object({
  email: z.string().email(),
});

export default function PasswordReset() {
  // Get email from query param
  const searchParams = useSearchParams();

  // Form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get('email') ?? ''),
    },
  });

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('bang');
    await passwordReset(data.email);
    // const { email } = data;
    // const response = await passwordReset({
    //   email,
    // });
    // if (response?.error) {
    //   toast({
    //     title: 'Password reset',
    //     description: response.error,
    //   });
    // } else {
    //   toast({
    //     title: 'Password reset',
    //     description: `An email has been sent to ${email}`,
    //   });
    // }
  };

  console.log(form.formState.errors);

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Password reset</CardTitle>
          <CardDescription>Enter your email in order to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleValidatedSubmit)}>
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
                <Button className="mt-8" type="submit">
                  Reset
                </Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </p>
            <p>
              Do not have an account yet?{' '}
              <Link href="/register" className="underline">
                Register
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
