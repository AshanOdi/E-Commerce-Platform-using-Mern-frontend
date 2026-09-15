import axios from "axios";
import { useState } from "react";

// "form" | "submitting" | "success" | "error"
export default function ContactPage() {
  const [status, setStatus] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage("Please fill in every field.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/contact", {
        name,
        email,
        subject,
        message,
      });
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong. Please try again.");
      setStatus("form");
    }
  }

  if (status === "success") {
    return (
      <main className="w-full max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Message sent</h1>
        <p className="text-gray-600 mt-2">
          Thanks for reaching out — we'll get back to you as soon as we can.
        </p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Questions about an order, a product, or anything else — send us a message below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={2000}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        {errorMessage && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </main>
  );
}
