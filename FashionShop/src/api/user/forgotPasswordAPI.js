import { ref, watch  } from "vue";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export function forgotPasswordAPI() {
  const email = ref("");
  const otp = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");

  const step = ref(1);
  const fieldErrors = ref({});

  const isSendingOtp = ref(false);
  const isVerifyingOtp = ref(false);
  const isResettingPassword = ref(false);

  const resetState = () => {
    email.value = "";
    otp.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    step.value = 1;
    fieldErrors.value = {};
  };

  const handleValidationError = (res) => {
    // Nếu có lỗi theo trường
    if (res.data?.errors) {
      fieldErrors.value = res.data.errors;
    } else {
      // Nếu không có lỗi chi tiết, show iziToast
      iziToast.error({
        title: "Lỗi",
        message: res.data?.message || "Có lỗi xảy ra.",
        position: "topRight",
      });
    }
  };

  const sendOtp = async () => {
    fieldErrors.value = {};
    isSendingOtp.value = true;

    try {
      const res = await axios.post("http://localhost:8080/api/forgot-password", {
        email: email.value.trim(),
      });

      if (res.data.status === "success") {
        iziToast.success({
          title: "Thành công",
          message: res.data.message,
          position: "topRight",
        });
        step.value = 2;
      } else {
        handleValidationError(res);
      }
    } catch {
      iziToast.error({
        title: "Lỗi",
        message: "Không thể gửi OTP",
        position: "topRight",
      });
    } finally {
      isSendingOtp.value = false;
    }
  };

  const verifyOtp = async () => {
    fieldErrors.value = {};
    isVerifyingOtp.value = true;

    try {
      const res = await axios.post("http://localhost:8080/api/verify-otp", {
        email: email.value.trim(),
        otp: otp.value.trim(),
      });

      if (res.data.status === "success") {
        iziToast.success({
          title: "Thành công",
          message: res.data.message,
          position: "topRight",
        });
        step.value = 3;
      } else {
        handleValidationError(res);
      }
    } catch {
      iziToast.error({
        title: "Lỗi",
        message: "Xác minh OTP thất bại",
        position: "topRight",
      });
    } finally {
      isVerifyingOtp.value = false;
    }
  };

  const resetPassword = async () => {
    fieldErrors.value = {};
    isResettingPassword.value = true;

    try {
      const res = await axios.post("http://localhost:8080/api/reset-password", {
        email: email.value.trim(),
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      });

      if (res.data.status === "success") {
        iziToast.success({
          title: "Thành công",
          message: res.data.message,
          position: "topRight",
        });

        setTimeout(() => {
          resetState();
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("forgotPasswordModal")
          );
          modal?.hide();
        }, 1500);
      } else {
        handleValidationError(res);
      }
    } catch {
      iziToast.error({
        title: "Lỗi",
        message: "Không thể đặt lại mật khẩu",
        position: "topRight",
      });
    } finally {
      isResettingPassword.value = false;
    }
  };

  const autoClearFieldError = (fieldRef, fieldName) => {
    watch(fieldRef, () => {
      if (fieldErrors.value[fieldName]) {
        delete fieldErrors.value[fieldName];
      }
    });
  };

  autoClearFieldError(email, "email");
  autoClearFieldError(otp, "otp");
  autoClearFieldError(newPassword, "newPassword");
  autoClearFieldError(confirmPassword, "confirmPassword");

  return {
    email,
    otp,
    newPassword,
    confirmPassword,
    step,
    fieldErrors,
    isSendingOtp,
    isVerifyingOtp,
    isResettingPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
    resetState,
  };
}
