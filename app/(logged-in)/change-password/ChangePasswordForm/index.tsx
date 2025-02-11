'use client';

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
import { passwordMatchSchema, passwordSchema } from '@/validation/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { changePassword } from './actions';

const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

export default function ChangePasswordForm() {
  // Init react hook form with validation managed by Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleValidatedSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await changePassword(data);

    if (response?.error) {
      form.setError('root', {
        message: response.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidatedSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
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
            Change password
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
