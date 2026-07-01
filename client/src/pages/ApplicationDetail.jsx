import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [app, setApp] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    getToken().then(async (token) => {
      setAuthToken(token);
      const [appRes, contactsRes, notesRes] = await Promise.all([
        api.get(`/api/applications/${id}`),
        api.get(`/api/contacts/application/${id}`),
        api.get(`/api/notes/application/${id}`),
      ]);
      setApp(appRes.data);
      setContacts(contactsRes.data);
      setNotes(notesRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this application?")) return;
    const token = await getToken();
    setAuthToken(token);
    await api.delete(`/api/applications/${id}`);
    navigate("/applications");
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSubmittingNote(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.post("/api/notes", {
        applicationId: id,
        content: noteContent,
      });
      setNotes([res.data, ...notes]);
      setNoteContent("");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const token = await getToken();
    setAuthToken(token);
    await api.delete(`/api/notes/${noteId}`);
    setNotes(notes.filter((n) => n._id !== noteId));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!app) return <div className="p-6">Application not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{app.company}</h1>
          <p className="text-gray-500">{app.role}</p>
          {app.location && (
            <p className="text-sm text-gray-400">
              {app.location}
              {app.isRemote ? " · Remote" : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <StatusBadge status={app.status} />
          <Link
            to={`/applications/${id}/edit`}
            className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6 text-sm">
        {app.jobUrl && (
          <div>
            <p className="text-gray-400">Job URL</p>
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline truncate block"
            >
              {app.jobUrl}
            </a>
          </div>
        )}
        {app.salary && (
          <div>
            <p className="text-gray-400">Salary</p>
            <p>{app.salary}</p>
          </div>
        )}
        <div>
          <p className="text-gray-400">Date Applied</p>
          <p>
            {new Date(app.dateApplied).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Contacts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Contacts</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-400 text-sm">No contacts added yet.</p>
        ) : (
          contacts.map((c) => (
            <div key={c._id} className="border rounded-lg p-3 mb-2 text-sm">
              <p className="font-medium">{c.name}</p>
              {c.role && <p className="text-gray-500">{c.role}</p>}
              {c.email && <p className="text-gray-400">{c.email}</p>}
              {c.linkedIn && (
                <a
                  href={c.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Notes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Notes</h2>
        <form onSubmit={handleAddNote} className="mb-4">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="w-full border rounded p-2 text-sm mb-2 h-20 resize-none"
          />
          <button
            type="submit"
            disabled={submittingNote}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {submittingNote ? "Saving..." : "Add Note"}
          </button>
        </form>
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <div
              key={n._id}
              className="border rounded-lg p-3 mb-2 text-sm flex justify-between items-start"
            >
              <div>
                <p>{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDeleteNote(n._id)}
                className="text-red-400 hover:text-red-600 text-xs ml-4"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
