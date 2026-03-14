import { useState } from "react";
import api from "../api.js";
import { toast } from "react-toastify";

export default function MessageModal({ isOpen, onClose, candidate, jobTitle }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(candidate?.email || "");
  const [sendMethod, setSendMethod] = useState("message"); // "message" or "email"

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      if (sendMethod === "message") {
        await api.post("notifications/send/", {
          recipient_id: candidate.id,
          subject: `Regarding your application for ${jobTitle}`,
          body: message,
        });
        toast.success("Message sent successfully!");
      } else {
        await api.post("notifications/email/", {
          email: email,
          subject: `Regarding your application for ${jobTitle}`,
          message: message,
        });
        toast.success("Email sent successfully!");
      }
      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          Contact {candidate?.username || "Candidate"}
        </h3>

        {/* Send Method Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSendMethod("message")}
            className={`px-4 py-2 rounded-lg ${
              sendMethod === "message"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            In-App Message
          </button>
          <button
            onClick={() => setSendMethod("email")}
            className={`px-4 py-2 rounded-lg ${
              sendMethod === "email"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Send Email
          </button>
        </div>

        {/* Email field (only show for email method) */}
        {sendMethod === "email" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="candidate@email.com"
            />
          </div>
        )}

        {/* Message Body */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none"
            placeholder="Write your message to the candidate..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
