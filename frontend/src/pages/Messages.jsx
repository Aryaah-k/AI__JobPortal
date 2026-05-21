import { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import { MessageSquare, Calendar, MailOpen, User2 } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("notifications/inbox/");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonRow = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-250 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-250 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={30} />
          Messages
        </h1>
        <p className="text-gray-500 mt-1">
          Review communications sent to you by employers and recruiters regarding your active applications.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
            <MailOpen size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Your inbox is empty</h3>
          <p className="text-gray-500 text-sm max-w-xs mb-2 leading-relaxed">
            You haven't received any messages yet. Recruiters will contact you here regarding applications or matching profiles!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex gap-4"
            >
              {/* Left Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-55 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                {msg.sender_detail?.username?.charAt(0).toUpperCase() || <User2 size={16} />}
              </div>

              {/* Right Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="font-bold text-gray-800 text-base">
                    {msg.subject}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(msg.sent_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-650 text-sm leading-relaxed mb-1">
                  {msg.body}
                </p>

                <div className="text-xs text-gray-400 mt-2.5">
                  Sender: <span className="font-medium text-gray-600">{msg.sender_detail?.username || "Recruiter"}</span> ({msg.sender_detail?.email})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

