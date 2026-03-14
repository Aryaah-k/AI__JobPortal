import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("notifications/inbox/");
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {messages.length === 0 && (
        <p className="text-gray-500">No messages</p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <h3 className="font-semibold">{msg.subject}</h3>
            <p className="text-gray-600">{msg.body}</p>

            <span className="text-xs text-gray-400">
              {new Date(msg.sent_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Layout>
  );
}

