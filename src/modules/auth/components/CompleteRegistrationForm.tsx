'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { Check, X } from "lucide-react"
import { CompleteRegistrationData, completeRegistrationSchema } from "../schemas/completeRegistrationSchema"
import { useFieldValidator } from "@/shared/hooks/useFieldValidator"
import Spinner from "@/components/ux/Spinner"
import { completeRegistration } from "@/services/auth/authService"
import { Input } from "@/components/ux/Input"
import { Button } from "@/components/ux/Button"

interface CompleteRegistrationFormProps {
  email: string
}


const genders = [
  { label: "Masculino", value: "MALE" },
  { label: "Femenino", value: "FEMALE" },
  { label: "Otro", value: "UNSPECIFIED" },
];
export function CompleteRegistrationForm({email}:CompleteRegistrationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
    mode: 'onChange',
    defaultValues:{
      username:'',
      name:'',
      lastname:'',
      dni:'',
      phone:'',
      gender:undefined,
      birthDate:'',
      password:'',
      confirmPassword:''
    }
  })

  const usernameValidation = useFieldValidator('username')
  const dniValidation = useFieldValidator('dni');
  const phoneValidation = useFieldValidator('phone')

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "username" && value.username) {
        if (!errors.username){
          usernameValidation.validate(value.username);
        }
      }else if(name === "dni" && value.dni){
        if(!errors.dni){
          dniValidation.validate(value.dni)
        }
      }else if(name === "phone" && value.phone){
        if(!errors.phone){
          phoneValidation.validate(value.phone)
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch,errors, usernameValidation,dniValidation,phoneValidation]);

  const getRightIcon = (validation: ReturnType<typeof useFieldValidator>) => {
    if (validation.checking) return <Spinner size={16} />;
    if (validation.available === true) return <Check className="w-4 h-4 text-success" />;
    if (validation.available === false) return <X className="w-4 h-4 text-error" />;
    return null;
  };

  //Metodo para determinar si pasan todas las validaciones
  const allValidationsPassed = () =>{
    return(
      usernameValidation.messageType === 'success' &&
      dniValidation.messageType === 'success' &&
      phoneValidation.messageType === 'success'
    );
  }

  const formatDate = (date: string) => {
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  };

  const onSubmit = async (data: CompleteRegistrationData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...data,
        gender: data.gender || "UNSPECIFIED",   
        birthDate: formatDate(data.birthDate),
      }
      await completeRegistration(email, payload)
      router.push(`/email-verify?email=${email}`)
    } catch {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Nombre de usuario solo */}
        <div>        
          <Input
            label="Nombre de usuario"
            type="text"
            {...register("username")}
            error={errors.username?.message}
            rightIcon={!errors.username?.message ? getRightIcon(usernameValidation): undefined}

          />
          {(usernameValidation.message && !errors.username?.message) && (
            <p className={`text-xs font-inter mt-1 ${
              usernameValidation.messageType === 'success' ? 'text-success' : 'text-error'
            }`}>
              {usernameValidation.message}
            </p>
          )}
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Apellido"
            type="text"
            {...register("lastname")}
            error={errors.lastname?.message}
          />
        </div>

        {/* DNI y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="DNI"
              type="text"
              {...register("dni")}
              error={errors.dni?.message}
              rightIcon={!errors.dni?.message ?getRightIcon(dniValidation):undefined}
            />
            {(dniValidation.message && !errors.dni?.message) && (
              <p className={`text-xs font-inter mt-1 ${
                dniValidation.messageType === 'success' ? 'text-success' : 'text-error'
              }`}>
                {dniValidation.message}
              </p>
            )}
          </div>
          <div>          
            <Input
              label="Teléfono"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
              rightIcon={!errors.phone?.message ?getRightIcon(phoneValidation):undefined}
            />
            {(phoneValidation.message && !errors.phone?.message) && (
              <p className={`text-xs font-inter mt-1 ${
                phoneValidation.messageType === 'success' ? 'text-success' : 'text-error'
              }`}>
                {phoneValidation.message}
              </p>
            )}
          </div>
        </div>

        {/* Genero y Fecha de nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label htmlFor="gender" className="block mb-1 font-medium text-sm font-outfit">Género</label>
            <select
              id="gender"
              {...register('gender', { required: "El género es obligatorio" })}
              className={`w-full rounded-md border border-gray-2 px-3 py-2 font-outfit cursor-pointer dark:bg-dark-5`}
              defaultValue=""
            >
              <option value="" disabled >Seleccioná un género</option>
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-error text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>

          <Input
            label="Fecha de Nacimiento"
            type="date"
            autoComplete="birthDate"
            {...register('birthDate')}
            error={errors.birthDate?.message}
          />
            
        </div>


        {/* Contraseña y Confirmar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button variant="primary" type="submit" className="w-full mt-4" disabled={loading || isSubmitting || !allValidationsPassed()}>
          {loading ? <Spinner size={20} /> : "Registrarse"}
        </Button>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  )
}