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
      screen.getByLabelText(content.getInvolved.form.name.label),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(content.getInvolved.form.email.label),
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
      screen.getByLabelText(content.getInvolved.form.name.label),
      { target: { value: "Ada" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.email.label),
      { target: { value: "ada@utoronto.ca" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.message.label),
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
      screen.getByLabelText(content.getInvolved.form.name.label),
      { target: { value: "Ada" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.email.label),
      { target: { value: "ada@utoronto.ca" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.message.label),
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

describe("Topic dropdown", () => {
  it("opens, picks with the mouse, and sends the chosen topic", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

    render(<ContactFormActive />);
    const box = screen.getByRole("combobox");
    expect(box).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(box);
    expect(box).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("option", { name: "Joining the group" }));
    expect(box).toHaveTextContent("Joining the group");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.name.label),
      { target: { value: "Ada" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.email.label),
      { target: { value: "ada@utoronto.ca" } },
    );
    fireEvent.change(
      screen.getByLabelText(content.getInvolved.form.message.label),
      { target: { value: "hello there" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: content.getInvolved.form.submit }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse(
      String((fetchMock.mock.calls[0][1] as RequestInit).body),
    );
    expect(body.topic).toBe("Joining the group");
  });

  it("works from the keyboard and closes on Escape", () => {
    render(<ContactFormActive defaultTopic="Other" />);
    const box = screen.getByRole("combobox");
    expect(box).toHaveTextContent("Other");
    fireEvent.keyDown(box, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(box, { key: "Home" });
    fireEvent.keyDown(box, { key: "Enter" });
    expect(box).toHaveTextContent("General question");
    fireEvent.keyDown(box, { key: "ArrowDown" });
    fireEvent.keyDown(box, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
