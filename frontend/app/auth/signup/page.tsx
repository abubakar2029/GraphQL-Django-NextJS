"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SIGNUP_MUTATION } from "@/lib/graphql/mutations"

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION)

  const onSubmit = async (data: any) => {
    try {
      const response: any = await signup({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      })

      const { accessToken } = response.data.signup;

      console.log(response.data.signup);


      if (accessToken) {
        const { setAccessToken } = await import('@/lib/auth');
        setAccessToken(accessToken);
        setIsSuccess(true);
      }

    } catch (err) {
      console.error("Signup error:", err)
      // Handle error
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
        <p className="text-muted-foreground mb-6">
          Your account has been successfully created. You are now logged in.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-semibold text-foreground">Signup</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance text-center">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter your details below to get started
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sm:p-8">
        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full h-11 gap-3 text-foreground"
            type="button"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 gap-3 text-foreground"
            type="button"
          >
            <FacebookIcon />
            Continue with Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 gap-3 text-foreground"
            type="button"
          >
            <GitHubIcon />
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            or
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                {...register("firstName", { required: true })}
                autoComplete="given-name"
              />
              {errors.firstName && <span className="text-red-500 text-xs">First name is required</span>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName", { required: true })}
                autoComplete="family-name"
              />
              {errors.lastName && <span className="text-red-500 text-xs">Last name is required</span>}

            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              {...register("email", { required: true })}
              autoComplete="email"
            />
            {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password", { required: true, minLength: 8 })}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">Password must be at least 8 characters</span>}
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
          {"By signing up, you agree to our "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </a>
          {" and "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <p className="text-sm text-muted-foreground text-center mt-6">
        {"Already have an account? "}
        <a href="#" className="text-primary font-medium hover:underline underline-offset-4">
          Sign in
        </a>
      </p>
    </div>
  )
}
