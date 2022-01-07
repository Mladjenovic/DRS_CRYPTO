import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Nav, Navbar, Container, Row } from "react-bootstrap";

import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserAddOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function CustomLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({});

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const logoutHandler = () => {
    console.log("Logout handler");
    localStorage.clear();
  };

  useEffect(() => {
    try {
      setUserData(localStorage.getItem("userData"));
    } catch {
      console.log("User is not yet logged in!");
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<LoginOutlined />}>
            <Link to="/login/">Login</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserAddOutlined />}>
            <Link to="/register/">Register</Link>
          </Menu.Item>
          {userData ? (
            <>
              <Menu.Item key="4" icon={<UserAddOutlined />}>
                <Link to="/profile-settings/">Profile Settings</Link>
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
          {userData ? (
            <>
              <Menu.Item key="5" icon={<LogoutOutlined />}>
                <a href="/login" onClick={logoutHandler}>
                  Logout
                </a>
                {/* <Link to="/login/" onCLick={() => logoutHandler}>
                  Logout
                </Link> */}
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Current User</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Routes>
              <Route exact path="/" element={<HomeScreen />}></Route>
              <Route exact path="/login" element={<LoginScreen />}></Route>
              <Route
                exact
                path="/register"
                element={<RegisterScreen />}
              ></Route>
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Oneline Crypto exhange service
        </Footer>
      </Layout>
    </Layout>
  );
}

export default CustomLayout;
