import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
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
        className="flex flex-col gap-6 bg-blue-400 p-8 md:p-12 rounded-2xl shadow-lg w-full max-w-lg"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-black">
          Create an Account
        </h2>

        <div className="flex flex-col md:flex-row gap-5">
          <label className="text-black text-sm font-bold flex-1">
            First Name
            <input
              className="border rounded w-full py-2 px-3 font-normal mt-1"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
          </label>
          <label className="text-black text-sm font-bold flex-1">
            Last Name
            <input
              className="border rounded w-full py-2 px-3 font-normal mt-1"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </label>
        </div>

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

        <label className="text-black text-sm font-bold flex-1">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 font-normal mt-1"
            {...register("confirmPassword", {
              validate: (val) => {
                if (!val) {
                  return "This field is required";
                } else if (watch("password") !== val) {
                  return "Your passwords do not match";
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition duration-200"
        >
          Create Account
        </button>

        <p className="text-center text-gray-800 text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-blue-900 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
