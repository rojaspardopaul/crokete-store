import { z } from "zod";

const signupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }).trim(),
  phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos." })
    .max(15, { message: "El teléfono debe tener máximo 15 dígitos." })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: "La confirmación debe tener al menos 8 caracteres." })
    .trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

const loginFormSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }).trim(),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    // .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Debe contener al menos un carácter especial.",
    // })
    .trim(),
});

const updateProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  address: z
    .string()
    .min(6, { message: "La dirección debe tener al menos 6 caracteres." })
    .trim(),
  phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos." })
    .max(15, { message: "El teléfono debe tener máximo 15 dígitos." })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
    .trim(),
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }).trim(),
  image: z
    .string()
    .url()
    .refine(
      (url) => {
        // Check for common image file extensions
        const commonImageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(
          url
        );
        // Check for Google user content URLs
        const googleImage = /lh3\.googleusercontent\.com/.test(url);
        // Check for Facebook user content URLs
        const facebookImage = /fbcdn\.net/.test(url);
        // Check for GitHub user content URLs
        const githubImage = /avatars\.githubusercontent\.com/.test(url);

        return (
          commonImageExtensions || googleImage || facebookImage || githubImage
        );
      },
      {
        message: "URL de imagen inválida. La URL debe apuntar a una imagen válida.",
      }
    ),
});

const changePasswordFormSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }).trim(),
  currentPassword: z
    .string()
    .min(8, { message: "La contraseña actual es requerida." })
    .trim(),

  newPassword: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
});

const shippingAddressFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .trim(),
  address: z
    .string()
    .min(10, { message: "La dirección debe tener al menos 10 caracteres." })
    .trim(),
  contact: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 dígitos." })
    .max(15, { message: "El teléfono debe tener máximo 15 dígitos." })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
    .trim(),
  country: z.string().min(2, { message: "El país es requerido." }).trim(),
  city: z.string().min(2, { message: "La ciudad es requerida." }).trim(),
  area: z.string().min(2, { message: "El área es requerida." }).trim(),
});

const checkoutFormSchema = (shippingOptions) => {
  // console.log("shippingOptions:::", shippingOptions);
  return z.object({
    firstName: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .trim(),
    lastName: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
      .trim(),
    email: z.string().email({ message: "Por favor, ingresa un correo válido." }).trim(),
    contact: z
      .string()
      .min(10, { message: "El teléfono debe tener al menos 10 dígitos." })
      .max(15, { message: "El teléfono debe tener máximo 15 dígitos." })
      .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
      .trim(),
    address: z
      .string()
      .min(5, { message: "La dirección debe tener al menos 5 caracteres." })
      .trim(),
    city: z
      .string()
      .min(2, { message: "La ciudad debe tener al menos 2 caracteres." })
      .trim(),
    country: z
      .string()
      .min(2, { message: "El país debe tener al menos 2 caracteres." })
      .trim(),
    zipCode: z
      .string()
      .min(5, { message: "El código postal debe tener al menos 5 dígitos." })
      .max(10, { message: "El código postal debe tener máximo 10 dígitos." })
      .regex(/^\d+$/, { message: "El código postal solo debe contener números." })
      .trim(),

    paymentMethod: z.enum(["Cash", "Card"], {
      message: "El método de pago es requerido.",
    }),
    shippingOption: z.enum(shippingOptions, {
      message: "El costo de envío es requerido.",
    }),
  });
};

export {
  signupFormSchema,
  loginFormSchema,
  updateProfileFormSchema,
  changePasswordFormSchema,
  checkoutFormSchema,
  shippingAddressFormSchema,
};
