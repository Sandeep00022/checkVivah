import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface File {
  _id: string;
  name: string;
  type: string;
  size: number;
  fileUrl: string;
}

export interface FileState {
  files: File[] | null;
  error: string | null;
  loading: boolean;
}

const initialState: FileState = {
  files: null,
  error: null,
  loading: false,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    fileUploadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fileUploadSuccess: (state, action: PayloadAction<File>) => {
      state.files = [action.payload, ...(state.files || [])];
      state.loading = false;
      state.error = null;
    },
    fileUploadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getFilesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getFilesSuccess: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFilesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fileUploadStart,
  getFilesStart,
  getFilesSuccess,
  getFilesFailure,
  fileUploadFailure,
  fileUploadSuccess,
} = fileSlice.actions;

export default fileSlice.reducer;
