import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "../api/axios";
import { Alert, Box,  Container, Typography } from "@mui/material";
import validationSchema from "../services/validations/RegisterForm.js";
import UserFields from "../components/UserFields.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState("");
  // isVerified is used to determine if the user has verified their email, but currently not used
  const [isVerified, setVerified] = useState(false);
  const [verifyDisabled, setVerifyDisabled] = useState(false);
  const [verifyCountdown, setVerifyCountdown] = useState(0);
  const [checkDisabled, setCheckDisabled] = useState(false);
  const [checkCountdown, setCheckCountdown] = useState(0);
  const navigate = useNavigate();
  // Success message
  const [message, setMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  useEffect(() => {
    if (verifyDisabled && verifyCountdown > 0) {
      setTimeout(() => setVerifyCountdown(verifyCountdown - 1), 1000);
    } else if (verifyCountdown === 0) {
      setVerifyDisabled(false);
      // setVerifyCountdown(60);
    }
  }, [verifyDisabled, verifyCountdown]);

  useEffect(() => {
    if (checkDisabled && checkCountdown > 0) {
      setTimeout(() => setCheckCountdown(checkCountdown - 1), 1000);
    } else if (checkCountdown === 0) {
      setCheckDisabled(false);
      // setCheckCountdown(60);
    }
  }, [checkDisabled, checkCountdown]);
  const sendVerificationEmail = async (email, username, password) => {
    formik.submitForm();
    // Logic changed, now this btn works as submit btn (reigster btn)
    // try {
    //   const res = await axios.post("/register/", {
    //     email,
    //     username,
    //     password,
    //   });
    //   if (res.status === 200) {
    //     console.log(res.data);
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const checkVerificationCode = async (email, code) => {
    try {
      const res = await axios.post("/register/verify_email/", {
        email,
        otp: code,
      });
      if (res.status === 200) {
        setVerified(true);
        setMessage(res.data.status);
        setAlertSeverity("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const submitForm = async (values, formikHelpers) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value),
      );
      const res = await axios.post("/register/", formData);
      // console.log(res.data); // Here you would usually store the JWT in local storage and redirect the user
      // formikHelpers.resetForm();
      setMessage(res.data.status);
      setAlertSeverity("success");
    } catch (err) {
      console.log(err.response.data);
      let errorMessage = "";
      if (err.response.data.username && err.response.data.username.length > 0) {
        errorMessage = err.response.data.username[0];
      } else {
        errorMessage = "An error occurred. Please try again.";
      }
      setErrors({
        api: errorMessage,
      });
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      // bio: "",
      // avatar: null,
      // role: "",
    },
    validationSchema: validationSchema,
    onSubmit: submitForm,
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          gutterBottom="true"
          sx={{ fontWeight: "bold", color: "grey.700" }}
        >
          Register
        </Typography>
        <Typography
          component="h2"
          variant="body1"
          gutterBottom="true"
          sx={{ color: "grey.800" }} // Adjust the color as you like
        >
          Please verify your Northeastern email before proceeding to login.
        </Typography>

        {message && (
          <Alert severity={alertSeverity} sx={{ marginTop: 2 }}>
            {message}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <UserFields
            formik={formik}
            showUsername={true}
            showPassword={true}
            showConfirmPassword={true}
            showEmail={true}
            showEmailVerify={true}
            showEmailCheck={true}
            showBio={false}
            showRoleSelector={false}
            showAvatarUpload={false}
            verifyDisabled={verifyDisabled}
            verifyCountdown={verifyCountdown}
            setVerifyDisabled={setVerifyDisabled}
            sendVerificationEmail={sendVerificationEmail}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            checkDisabled={checkDisabled}
            checkCountdown={checkCountdown}
            setCheckDisabled={setCheckDisabled}
            checkVerificationCode={checkVerificationCode}
            errors={errors}
          />
          {/* don't need it temporarily
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting || !isVerified}
          >
            Register
          </Button>
          */}
        </form>
      </Box>
    </Container>
  );
};

export default Register;
