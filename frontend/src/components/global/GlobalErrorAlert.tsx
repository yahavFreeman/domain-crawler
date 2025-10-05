import type { RootState } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../store/global/globalSlice";
import { Alert } from "@mui/material";

export const GlobalErrorAlert: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.global.error);
  // Only render if there's an error to show
  if (!error) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-gray-800/50">
      <Alert
        severity="error"
        onClose={() => dispatch(clearError())}
        className="max-w-md w-full"
      >
        {error}
      </Alert>
    </div>
  );
};
