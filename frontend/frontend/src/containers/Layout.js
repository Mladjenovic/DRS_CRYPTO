import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Nav, Navbar, Container, Row } from "react-bootstrap";

import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserAddOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  LineChartOutlined,
  PlusCircleOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import AccountScreen from "../screens/AccountScreen";
import InserMoneyScreen from "../screens/InserMoneyScreen";
import ActivateUserScreen from "../screens/ActivateUserScreen";

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
      setUserData(JSON.parse(localStorage.getItem("userData")));
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
          {userData ? (
            <></>
          ) : (
            <>
              <Menu.Item key="2" icon={<LoginOutlined />}>
                <Link to="/login/">Login</Link>
              </Menu.Item>
            </>
          )}
          {userData ? (
            <></>
          ) : (
            <>
              <Menu.Item key="3" icon={<UserAddOutlined />}>
                <Link to="/register/">Register</Link>
              </Menu.Item>
            </>
          )}
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
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
          {userData ? (
            <>
              <Menu.Item key="6" icon={<LineChartOutlined />}>
                <Link to="/account/"> Account</Link>
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
          {userData ? (
            <>
              <Menu.Item key="7" icon={<PlusCircleOutlined />}>
                <Link to="/insert-money/"> Insert money</Link>
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
          {userData && !userData.isActive ? (
            <>
              <Menu.Item key="8" icon={<UserSwitchOutlined />}>
                <Link to="/activete-user/"> Activate</Link>
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
              <Route
                exact
                path="/profile-settings/"
                element={<ProfileSettingsScreen />}
              ></Route>
              <Route exact path="/account/" element={<AccountScreen />}></Route>
              <Route
                exact
                path="/insert-money/"
                element={<InserMoneyScreen />}
              ></Route>
              <Route
                exact
                path="/activete-user/"
                element={<ActivateUserScreen />}
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
