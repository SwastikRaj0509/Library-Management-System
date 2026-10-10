import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock the API module
vi.mock("../services/api", () => ({
  default: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import API from "../services/api";

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login Page", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render email and password inputs", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should render the Login button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should render a link to the Register page", () => {
    renderLogin();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("should render Forgot Password link", () => {
    renderLogin();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  it("should save token to localStorage and navigate to dashboard on successful login", async () => {
    API.post.mockResolvedValue({
      data: { token: "fake.jwt.token", name: "Swastik", role: "user" },
    });

    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(localStorage.getItem("token")).toBe("fake.jwt.token");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should redirect to dashboard if token already exists", () => {
    localStorage.setItem("token", "existing.token");
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

});
