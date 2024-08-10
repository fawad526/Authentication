import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', data.token); // Save token in localStorage
          dispatch(setCredentials(data)); // Update credentials in Redux store if needed
        } catch (err) {
          console.error('Error saving token:', err);
        }
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch }) {
        localStorage.removeItem('token'); // Clear token from localStorage on logout
        dispatch(setCredentials({})); // Clear credentials from Redux store if needed
      }
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        console.log("Token in updateUser:", token); // Debug token value

        if (!token) {
          console.error("No token found"); // Error handling if token is not found
        }

        return {
          url: `${USERS_URL}/profile`,
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in the headers
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = usersApiSlice;
