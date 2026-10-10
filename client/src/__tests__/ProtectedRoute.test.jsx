import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

// A simple dummy page to render inside ProtectedRoute
const Dashboard = () => <div>Dashboard Page</div>;
const LoginPage = () => <div>Login Page</div>;

// Helper: render ProtectedRoute wrapping Dashboard, with an initial route
const renderProtectedRoute = (initialRoute = "/dashboard") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should redirect to login if no token in localStorage", () => {
    renderProtectedRoute();
    // ProtectedRoute navigates to "/" which renders LoginPage
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Page")).not.toBeInTheDocument();
  });

  it("should render children if token exists in localStorage", () => {
    localStorage.setItem("token", "fake.jwt.token");
    renderProtectedRoute();
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("should NOT grant access if localStorage has empty string token", () => {
    localStorage.setItem("token", "");
    renderProtectedRoute();
    // Empty string is falsy → should redirect to login
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

});
