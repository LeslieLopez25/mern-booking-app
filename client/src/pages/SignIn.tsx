import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex justify-center items-center px-4">
      <form
        className="flex flex-col gap-6 bg-blue-400 p-8 md:p-12 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-black">Sign In</h2>

        <label className="text-black text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="border rounded w-full py-2 px-3 font-normal mt-1"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </label>

        <label className="text-black text-sm font-bold flex-1">
          Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 font-normal mt-1"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm">
            Not Registered?{" "}
            <Link className="underline text-blue-900" to="/register">
              Create an account here
            </Link>
          </span>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition duration-200"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
