import React, { useState, useEffect } from "react";

import { Table } from "react-bootstrap";

function AccountScreen() {
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [accountBalance, setAccountBalance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/auth/account-balance", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAccountBalance(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1 style={{ margin: "auto", width: "25%" }}>Account balance</h1>
      <br />
      {loading ? (
        <></>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            variant="dark"
            style={{ margin: "auto", width: "50%" }}
          >
            <thead>
              <tr>
                <th>id</th>
                <th>balance</th>
                <th>currency</th>
                <th>user_id</th>
              </tr>
            </thead>
            <tbody>
              {accountBalance.accounts.map((account, i) => {
                return [
                  <tr key={i}>
                    <td>{account.id}</td>
                    <td>{account.balance}</td>
                    <td>{account.currency}</td>
                    <td>{account.user_id}</td>
                  </tr>,
                ];
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default AccountScreen;
