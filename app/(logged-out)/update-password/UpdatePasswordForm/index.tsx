'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
import { updatePassword } from './actions';
import { useRouter } from 'next/navigation';

const formSchema = passwordMatchSchema;

type Props = {
  token: string;
};

export default function UpdatePasswordForm({ token }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  // Init react hook form with validation managed by Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await updatePassword({ ...data, token });

    if (response?.error) {
      toast({
        title: 'Password update',
        description: response.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password update',
        description: 'Your password has been updated.',
      });
      form.reset();
      router.push('/my-account');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidatedSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
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
                <FormLabel>New password confirm</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-8" type="submit">
            Update password
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
