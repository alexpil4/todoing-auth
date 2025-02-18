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
import { loginWithCredential } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    const response = await loginWithCredential({
      email,
      password,
    });

    if (response?.error) {
      form.setError('root', { message: response.message });
    } else {
      router.push('/my-account');
    }
  };

  const email = form.getValues('email');

  return (
    <main className="flex justify-center items-center min-h-screen">
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
    </main>
  );
}
