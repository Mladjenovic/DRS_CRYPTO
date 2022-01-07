import React, { useState, useEffect } from "react";

import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const onSubmit = (values) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
    };

    fetch("http://localhost:5000/auth/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.access_token);

        if (data.message != "Invalid email or password") {
          login(data.access_token);
          console.log("------------", data);
          localStorage.setItem("userData", JSON.stringify(data.userData));

          navigate("/");
          window.location.reload();
        } else {
          alert("Invalid email or password");
        }
      });
  };

  useEffect(() => {
    try {
      setUserData(localStorage.getItem("userData"));
    } catch {
      console.log("Error in geting userData from localStorage");
    }
  }, []);

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onSubmit}
      style={{ width: "35%", margin: "auto" }}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginScreen;
