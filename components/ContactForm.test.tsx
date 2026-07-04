import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm, { ContactFormActive } from "./ContactForm";
import { CONTACT_FORM_ENABLED } from "@/lib/flags";
import content from "@/lib/content";

afterEach(() => {
  vi.restoreAllMocks();
});

// The public <ContactForm /> shows the form or a disabled panel depending on
// the flag; the form behavior below is exercised against ContactFormActive so
// it stays covered regardless of the flag's current value.
describe("ContactForm (public)", () => {
  it("renders the disabled panel when the form is off", () => {
    if (CONTACT_FORM_ENABLED) return; // only meaningful while disabled
    render(<ContactForm />);
    expect(
      screen.getByRole("link", {
        name: content.getInvolved.form.disabled.discord.label,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: content.getInvolved.form.submit,
      }),
    ).not.toBeInTheDocument();
  });
});

describe("ContactFormActive", () => {
  it("renders the fields and submit button from content", () => {
    render(<ContactFormActive />);
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

    render(<ContactFormActive />);
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

    render(<ContactFormActive />);
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
