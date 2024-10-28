import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark',
  userId: null,  // Inicialmente sin usuario
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setUserId: (state, action) => {
      state.userId = action.payload;  // Asignar el userId recibido en el payload
    },
    clearUserId: (state) => {
      state.userId = null;  // Limpiar el userId al cerrar sesión
    },
  },
});

export const { setMode, setUserId, clearUserId } = globalSlice.actions;
export default globalSlice.reducer;
