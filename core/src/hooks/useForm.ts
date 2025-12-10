import { useForm, UseFormProps, DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const useFormWithValidation = <T extends z.ZodSchema>(
  schema: T,
  defaultValues?: DefaultValues<z.infer<T>>,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver' | 'defaultValues'>
) => {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<z.infer<T>>,
    ...options,
  })
}

