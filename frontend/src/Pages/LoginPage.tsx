import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/api/auth";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormFields = z.infer<typeof schema>

const LoginPage = () => {
  const navigate = useNavigate()
  const {
    register, 
    handleSubmit,
    setError,
    formState:{errors, isSubmitting}
  } = useForm<FormFields>({
    resolver:zodResolver(schema)
  })

const handleLoginFormSubmit: SubmitHandler<FormFields> = async (data) => {

  try {
    const response = await login(data.email, data.password)
    if (response) {
      navigate("/")
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
    <form onSubmit={handleSubmit(handleLoginFormSubmit)} >
        <div className='grid grid-cols-3 h-auto min-h-screen pt-16 pb-24'>
            <div className='flex flex-col col-start-2 col-end-3 justify-start items-center gap-y-8'>
                <div className='flex'>
                    <h1 className='text-black text-5xl font-bold'>Login</h1>
                </div>
                <div className='flex flex-col gap-y-6 w-full'>
                    <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Email</label>
                        <Input 
                        {...register("email")} 
                        type="email"  />
                        {errors.email && 
                        <div className="text-red-500">{errors.email.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-start items-start w-full gap-2'>
                        <label className='text-black'>Password</label>
                        <Input 
                        {...register("password")} 
                        type="password"  />
                        {errors.password && 
                        <div className="text-red-500">{errors.password.message}</div>
                        }
                    </div>
                    <div className='flex flex-col justify-center gap-4 items-center w-full'>
                        <Button disabled={isSubmitting} type="submit" className='text-white bg-black flex w-full' >
                          {isSubmitting ? ("Loading") : ("Login")}
                        </Button>
                        <Link className="font underline text-gray-800" to={"/register"}>Don't have an account? Register here</Link>
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

export default LoginPage;