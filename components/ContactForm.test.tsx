import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";
import content from "@/lib/content";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders the fields and submit button from content", () => {
    render(<ContactForm />);
    expect(
      screen.getByPlaceholderText(content.getInvolved.form.name.placeholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(content.getInvolved.form.email.placeholder),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: content.getInvolved.form.submit }),
    ).toBeInTheDocument();
  });

  it("posts to /api/contact and shows the success message", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

    render(<ContactForm />);
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.name.placeholder),
      { target: { value: "Ada" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.email.placeholder),
      { target: { value: "ada@utoronto.ca" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.message.placeholder),
      { target: { value: "I'd love to join." } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: content.getInvolved.form.submit }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(content.getInvolved.form.success),
      ).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows the server error message on failure", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Email isn't configured yet." }), {
        status: 500,
      }),
    );

    render(<ContactForm />);
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.name.placeholder),
      { target: { value: "Ada" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.email.placeholder),
      { target: { value: "ada@utoronto.ca" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(content.getInvolved.form.message.placeholder),
      { target: { value: "hello there" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: content.getInvolved.form.submit }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Email isn't configured yet.",
      ),
    );
  });
});
