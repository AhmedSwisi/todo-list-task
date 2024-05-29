import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {register} from "../api/auth"
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const schema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword:z.string().min(8)
}).superRefine(({password,confirmPassword}, ctx) => {
    if (confirmPassword !== password){
        ctx.addIssue({
            code:"custom",
            message:"Passwords do not match",
            path:['confirmPassword']
        })
    }
})

// type RegisterRequestBody = {
//   email: string,
//   password: string,
//   fullName:string
// }

type FormFields = z.infer<typeof schema>

const RegisterPage = () => {

    const navigate = useNavigate()
    const {
        register:registerField, 
        handleSubmit,
        setError,
        formState:{errors, isSubmitting}
      } = useForm<FormFields>({
        resolver:zodResolver(schema)
      })

    const handleRegisterFormSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await register(data.username, data.email, data.password)
            if (response) {
              navigate("/login")
            }
          } catch (error:unknown) {
            if (error instanceof AxiosError) {
              if (error.response !== undefined){
                setError("root", {message:error.response.data.detail})
              }
            }
          }
    }


  return(
    <form onSubmit={handleSubmit(handleRegisterFormSubmit)} >
        <div className='grid grid-cols-3 h-auto min-h-screen pt-16 pb-24'>
            <div className='flex flex-col col-start-2 col-end-3 justify-start items-center gap-y-8'>
                <div className='flex'>
                    <h1 className='text-black text-5xl font-bold'>Sign Up</h1>
                </div>
                <div className='flex flex-col gap-y-6 w-full'>
                <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Username </label>
                        <Input {...registerField("username")}   />
                        {errors.email && 
                        <div className="text-red-500">{errors.email.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Email</label>
                        <Input {...registerField("email")}   />
                        {errors.email && 
                        <div className="text-red-500">{errors.email.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Password</label>
                        <Input type="password" {...registerField("password")}  />
                        {errors.password && 
                        <div className="text-red-500">{errors.password.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Confirm Password</label>
                        <Input type="password" {...registerField("confirmPassword")}   />
                        {errors.confirmPassword && 
                        <div className="text-red-500">{errors.confirmPassword.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-center gap-4 items-center'>
                        <Button disabled={isSubmitting} type="submit" className='text-white bg-black w-full' >
                          {isSubmitting ? ("Loading") : ("Sign Up")}
                        </Button>
                        <Link className="font underline text-gray-800" to={"/login"}>Previously registered? Login here</Link>
                        {errors.root && 
                        <div className="text-red-500">{errors.root.message}</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    </form>
  );
};

export default RegisterPage;