import { useState, UseEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

import Message from "../components/Message";

function RegisterScreen() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");
  const onSubmit = (values) => {
    const body = {
      username: values.username,
      email: values.email,
      password: values.password,
      firstname: values.firstname,
      lastname: values.lastname,
      address: values.address,
      city: values.city,
      country: values.country,
      phone: values.phone,
    };

    console.log(body);

    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch("http://localhost:5000/auth/signup", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVariant("success");
        setMessage(data.message);
        if (data.message.includes("already exists")) {
          setMessage(data.message);
          setError(true);
          setVariant("danger");
        }
        navigate("/login");
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };
  return (
    <div>
      <h1 style={{ width: "20%", margin: "auto" }}>Register User:</h1>
      <br />
      <br />
      {error ? (
        <>
          <Message variant={variant} children={message}></Message>
        </>
      ) : (
        <></>
      )}
      <Form
        name="wrap"
        labelCol={{
          flex: "110px",
        }}
        labelAlign="left"
        labelWrap
        wrapperCol={{
          flex: 1,
        }}
        colon={false}
        style={{
          width: "40%",
          margin: "auto",
        }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="username"
          name="username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="firstname"
          name="firstname"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="lastname"
          name="lastname"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="address"
          name="address"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="city"
          name="city"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="country"
          name="country"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="phone"
          name="phone"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterScreen;
