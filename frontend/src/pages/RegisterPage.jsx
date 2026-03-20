import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
            <Wallet size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {mutation.isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
