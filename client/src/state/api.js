import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:5000` }),
  reducerPath: 'AdminApi',
  tagTypes: [
    'User',
    'Products',
    'Customers',
    'Transactions',
    'Geography',
    'Admins',
    'Performance',
    'Dashboard',
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ['User'],
    }),
    getUserByEmail: build.query({
      query: (email) => ({
        url: 'general/user',
        method: 'GET',
        params: { email }, // Se envía el email como parámetro en la query
      }),
      providesTags: ['User'],
    }),
    getProducts: build.query({
      query: () => 'client/products',
      providesTags: ['Products'],
    }),
    getCustomers: build.query({
      query: () => 'client/customers',
      providesTags: ['Customers'],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: 'client/transactions',
        method: 'GET',
        params: { page, pageSize, sort, search },
      }),
      providesTags: ['Transactions'],
    }),
    getGeography: build.query({
      query: () => 'client/geography',
      providesTags: ['Geography'],
    }),
    getSales: build.query({
      query: () => 'sales/sales',
      providesTags: ['Sales'],
    }),
    getAdmins: build.query({
      query: () => 'management/admins',
      providesTags: ['Admins'],
    }),
    getPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ['Performance'],
    }),
    getDashboard: build.query({
      query: () => 'general/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserByEmailQuery, // Nuevo hook para buscar usuario por email
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetPerformanceQuery,
  useGetDashboardQuery,
} = api;
