import { ref } from "vue";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export function registerOtpAPI() {
    const email = ref("");
    const otp = ref("");
    const isOtpSent = ref(false);
    const isSending = ref(false);
    const emailError = ref("");
    const otpError = ref("");
    const hasTriedSubmit = ref(false);

    // Regex kiểm tra email
    const validateEmail = (emailStr) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailStr);
    };

    const validateEmailInput = () => {
        const trimmed = email.value.trim();

        if (!trimmed) {
            emailError.value = "Email không được để trống.";
            return false;
        }

        if (/\s/.test(trimmed)) {
            emailError.value = "Email không được chứa khoảng trắng.";
            return false;
        }

        if (!validateEmail(trimmed)) {
            emailError.value = "Email không hợp lệ.";
            return false;
        }

        emailError.value = "";
        return true;
    };

    const validateOtpInput = () => {
        const trimmed = otp.value.trim();

        if (!trimmed) {
            otpError.value = "Vui lòng nhập mã OTP.";
            return false;
        }

        if (!/^\d{6}$/.test(trimmed)) {
            otpError.value = "Mã OTP phải gồm 6 chữ số.";
            return false;
        }

        otpError.value = "";
        return true;
    };

    // Gửi OTP
    const sendOtp = async (router) => {
        hasTriedSubmit.value = true;
        emailError.value = "";

        if (!validateEmailInput()) return;
        if (isSending.value) return;

        isSending.value = true;

        try {
            const formData = new FormData();
            formData.append("email", email.value.trim());

            const res = await axios.post("http://localhost:8080/api/register/otp", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            iziToast.success({
                title: "Thành công",
                message: res.data.message,
                position: "topRight",
            });

            isOtpSent.value = true;
        } catch (err) {
            iziToast.error({
                title: "Lỗi",
                message: err.response?.data?.error || "Lỗi gửi OTP",
                position: "topRight",
            });
        } finally {
            isSending.value = false;
        }
    };

    // Xác nhận OTP
    const confirmOtp = async (router) => {
    hasTriedSubmit.value = true;
    otpError.value = "";

    if (!validateEmailInput() || !validateOtpInput()) return;

    try {
        const formData = new FormData();
        formData.append("email", email.value.trim());
        formData.append("otp", otp.value.trim());

        const res = await axios.post("http://localhost:8080/api/register/otp", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.message === "Xác thực OTP thành công.") {
            iziToast.success({
                title: "Thành công",
                message: "Xác thực thành công. Chuyển hướng...",
                position: "topRight",
            });
            sessionStorage.setItem("verifiedEmail", res.data.email || email.value.trim());
            const modalElement = document.getElementById("registerOtpModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
                modalElement.addEventListener('hidden.bs.modal', () => {
                    // Xóa backdrop và khôi phục cuộn
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = 'auto';
                    document.documentElement.style.overflow = 'auto';
                    router.push("/register");
                }, { once: true });
            }
        } else {
            iziToast.error({
                title: "Lỗi",
                message: "Xác thực thất bại",
                position: "topRight",
            });
        }
    } catch (err) {
        iziToast.error({
            title: "Lỗi",
            message: err.response?.data?.error || "Xác thực thất bại",
            position: "topRight",
        });
    }
};

    // Gửi lại OTP
    const resendOtp = async () => {
        hasTriedSubmit.value = true;

        if (!validateEmailInput()) return;
        if (isSending.value) return;

        isSending.value = true;

        try {
            const formData = new FormData();
            formData.append("email", email.value.trim());

            await axios.post("http://localhost:8080/api/register/otp", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            iziToast.success({
                title: "Thành công",
                message: "Đã gửi lại mã OTP",
                position: "topRight",
            });
        } catch (err) {
            iziToast.error({
                title: "Lỗi",
                message: err.response?.data?.error || "Không thể gửi lại OTP",
                position: "topRight",
            });
        } finally {
            isSending.value = false;
        }
    };

    // Reset state
    const resetState = () => {
        email.value = "";
        otp.value = "";
        isOtpSent.value = false;
        isSending.value = false;
        emailError.value = "";
        otpError.value = "";
        hasTriedSubmit.value = false;
    };

    return {
        email,
        otp,
        isOtpSent,
        isSending,
        emailError,
        otpError,
        hasTriedSubmit,
        sendOtp,
        confirmOtp,
        resendOtp,
        resetState,
    };
}