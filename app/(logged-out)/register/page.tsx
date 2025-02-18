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
import { passwordMatchSchema } from '@/validation/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUser } from './actions';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema);

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password, passwordConfirm } = data;
    const response = await registerUser({
      email,
      password,
      passwordConfirm,
    });

    if (response?.error) {
      toast({
        title: 'Registration',
        description: response.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registration',
        description: 'Successfully registered.',
      });
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-1xl uppercase">YOUR ACCOUNT HAS BEEN CREATED</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Login your account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-1xl uppercase">REGISTER TODOING!</CardTitle>
            <CardDescription>Register for a new account.</CardDescription>
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
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password confirm</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="mt-8 uppercase" type="submit">
                    Register
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <div className="w-full text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
