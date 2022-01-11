import React, { useState, useEffect } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEdit } from "react-icons/fa";

function ProfileSettingsScreen() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [userInfo, setUserInfo] = useState([]);
  const [editable, setEditable] = useState(false);

  const handleEdit = () => {
    setEditable(true);
    document.getElementById("updateButton").style.display = "";
  };

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      setEditable(false);
      document.getElementById("updateButton").style.display = "none";

      const body = {
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      fetch("http://localhost:5000/auth/edit-user", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          window.location.reload(false);
        })
        .catch((err) => console.log(err));
    } else {
      alert("Passwords need to match");
    }
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/auth/edit-user", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserInfo(data);
        setValue("username", data.username);
        setValue("email", data.email);
        setValue("password", data.password);
        setValue("firstname", data.firstname);
        setValue("lastname", data.lastname);
        setValue("address", data.address);
        setValue("city", data.city);
        setValue("country", data.country);
        setValue("phone", data.phone);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Profile settings</h1>{" "}
      <form style={{ margin: "auto", width: "35%" }}>
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your firstname"
            {...register("firstname", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.firstname && (
            <small style={{ color: "red" }}>First name is required</small>
          )}
          {errors.firstname?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your lastname"
            {...register("lastname", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.lastname && (
            <small style={{ color: "red" }}>Last name is required</small>
          )}
          {errors.lastname?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your address"
            {...register("address", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.address && (
            <small style={{ color: "red" }}>Address is required</small>
          )}
          {errors.address?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your city"
            {...register("city", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.city && (
            <small style={{ color: "red" }}>City is required</small>
          )}
          {errors.city?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your country"
            {...register("country", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.country && (
            <small style={{ color: "red" }}>Country is required</small>
          )}
          {errors.country?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your phone"
            {...register("phone", { required: true, maxLength: 25 })}
            disabled={!editable}
          />

          {errors.phone && (
            <small style={{ color: "red" }}>Phone is required</small>
          )}
          {errors.phone?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be 25 </small>
            </p>
          )}
        </Form.Group>
        <br />

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            {...register("password", { required: true })}
            disabled={!editable}
          />

          {errors.password && (
            <p style={{ color: "red" }}>
              <small>Password is required</small>
            </p>
          )}
          {errors.password?.type === "minLength" && (
            <p style={{ color: "red" }}>
              <small>Min characters should be 8</small>
            </p>
          )}
        </Form.Group>
        <br></br>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            {...register("confirmPassword", { required: true })}
            disabled={!editable}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>
              <small>Confirm Password is required</small>
            </p>
          )}
          {errors.confirmPassword?.type === "minLength" && (
            <p style={{ color: "red" }}>
              <small>Min characters should be 8</small>
            </p>
          )}
        </Form.Group>
        <br></br>
        <Form.Group>
          <Button as="sub" variant="primary" onClick={() => handleEdit()}>
            <i className="fa fa-edit"></i>
            Edit
          </Button>
          <Button
            id="updateButton"
            as="sub"
            variant="primary"
            onClick={handleSubmit(submitForm)}
            style={{ display: "none", marginLeft: "10px" }}
          >
            Update
          </Button>
        </Form.Group>
        <br></br>
      </form>
    </div>
  );
}

export default ProfileSettingsScreen;
