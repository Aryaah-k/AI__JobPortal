import { useState, useEffect } from "react";
import api from "../api.js";
import { toast } from "react-toastify";
import { MessageSquare, Mail, ExternalLink, X } from "lucide-react";

export default function MessageModal({ isOpen, onClose, candidate, jobTitle }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState(candidate?.email || "");
  const [sendMethod, setSendMethod] = useState("message"); // "message", "email", or "gmail"

  // Keep candidate email state synchronized when the candidate prop changes
  useEffect(() => {
    if (candidate) {
      setEmail(candidate.email || "");
    }
  }, [candidate]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const subject = `Regarding your application for ${jobTitle}`;
      if (sendMethod === "message") {
        await api.post("notifications/send/", {
          recipient_id: candidate.id,
          subject: subject,
          body: message,
        });
        toast.success("Message sent successfully!");
      } else if (sendMethod === "email") {
        await api.post("notifications/email/", {
          email: email,
          subject: subject,
          message: message,
        });
        toast.success("Email sent successfully!");
      } else if (sendMethod === "gmail") {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          email
        )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
        toast.success("Gmail compose window opened successfully!");
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-150 transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Contact {candidate?.username || "Candidate"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a method to communicate regarding <span className="font-semibold text-gray-700">{jobTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-150 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Send Method Segmented Toggle */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-150 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setSendMethod("message")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                sendMethod === "message"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare size={16} />
              <span>In-App</span>
            </button>
            <button
              type="button"
              onClick={() => setSendMethod("email")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                sendMethod === "email"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail size={16} />
              <span>Email API</span>
            </button>
            <button
              type="button"
              onClick={() => setSendMethod("gmail")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                sendMethod === "gmail"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg
                className={`w-4 h-4 transition-colors ${
                  sendMethod === "gmail" ? "text-red-500" : "text-gray-500"
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7l-9 6L3 7v14H1.5C.65 21 0 20.35 0 19.5v-15c0-.85.65-1.5 1.5-1.5H3l9 6 9-6h1.5c.85 0 1.5.65 1.5 1.5z" />
              </svg>
              <span>Gmail</span>
            </button>
          </div>

          {/* Email field (only show for email & gmail methods) */}
          {sendMethod !== "message" && (
            <div className="mb-4 animate-slide-down">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Recipient Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 outline-none transition"
                  placeholder="candidate@email.com"
                />
              </div>
            </div>
          )}

          {/* Message Body */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Message Body
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3.5 py-2.5 h-36 resize-none text-sm text-gray-700 outline-none transition placeholder-gray-400"
              placeholder={`Write the message body here... We will automatically handle the subject line "Regarding your application for ${jobTitle}".`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                sendMethod === "gmail"
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-red-200"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"
              }`}
            >
              {sendMethod === "gmail" ? (
                <>
                  <ExternalLink size={16} />
                  <span>Open Gmail Compose</span>
                </>
              ) : (
                <>
                  <span>{sending ? "Sending..." : "Send Message"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
