import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { BriefcaseBusiness, GraduationCap, Mail, MapPin, Phone, User } from "lucide-react";

const userToForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  title: user?.title || "",
  phone: user?.phone || "",
  location: user?.location || "",
  experienceLevel: user?.experienceLevel || "",
  education: user?.education || "",
  skills: Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || "",
  portfolio: user?.portfolio || "",
  github: user?.github || "",
  linkedin: user?.linkedin || "",
  resumeUrl: user?.resumeUrl || "",
  profileImageUrl: user?.profileImageUrl || "",
  about: user?.about || "",
});

const toAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
};

function UserProfile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [form, setForm] = useState(userToForm(user));
  const [candidateImageFile, setCandidateImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [candidateImagePreview, setCandidateImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm(userToForm(user));
  }, [user]);

  useEffect(() => {
    if (!candidateImageFile) {
      setCandidateImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(candidateImageFile);
    setCandidateImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [candidateImageFile]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const { data: updatedUser } = await axios.put(API_PATHS.USERS.UPDATE, payload);
      let finalUser = updatedUser;

      if (candidateImageFile || resumeFile) {
        const fd = new FormData();
        if (candidateImageFile) fd.append("candidateImage", candidateImageFile);
        if (resumeFile) fd.append("resume", resumeFile);
        const { data } = await axios.post(API_PATHS.USERS.UPLOAD_ASSETS, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalUser = data;
      }

      setUser(finalUser);
      setForm(userToForm(finalUser));
      setCandidateImageFile(null);
      setResumeFile(null);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCandidateAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your candidate account?");
    if (!confirmed) return;

    try {
      await axios.delete(API_PATHS.USERS.DELETE);
      logout();
      toast.success("Candidate account deleted");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete account");
    }
  };

  const skillsList = useMemo(
    () =>
      form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.skills]
  );

  const profileImagePreview = candidateImagePreview || toAssetUrl(form.profileImageUrl);

  return (
    <DashboardLayout role="candidate">
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="Candidate"
              className="w-16 h-16 rounded-xl object-cover border rounded-full border-2 border-blue-500 "
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-blue-400 text-white flex items-center justify-center text-2xl font-bold">
              {(form.name || "C").charAt(0)}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">{form.name || "Candidate"}</h2>
            <div className="text-gray-500 text-sm flex gap-4 mt-1 flex-wrap">
              {form.title && (
                <span className="flex items-center gap-1">
                  <BriefcaseBusiness size={14} /> {form.title}
                </span>
              )}
              {form.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {form.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Mail size={14} /> {form.email}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditing((prev) => !prev);
            setMessage("");
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-8">
          {!editing ? (
            <>
              <section>
                <h3 className="text-lg font-semibold mb-3">About Candidate</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {form.about || "No profile summary added yet."}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Education</h3>
                <p className="text-gray-600">{form.education || "Not added"}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Work & Experience</h3>
                <p className="text-gray-600">
                  {form.title || "Role not added"}
                  {form.experienceLevel ? ` - ${form.experienceLevel}` : ""}
                </p>
              </section>
            </>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
                <Field label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
                <Field label="Professional Title" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
                <Field label="Location" value={form.location} onChange={(v) => setForm((p) => ({ ...p, location: v }))} />

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Experience Level</label>
                  <select
                    value={form.experienceLevel}
                    onChange={(e) => setForm((p) => ({ ...p, experienceLevel: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus_field"
                  >
                    <option value="">Select level</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <Field label="Education" value={form.education} onChange={(v) => setForm((p) => ({ ...p, education: v }))} />
                <Field label="Skills (comma separated)" value={form.skills} onChange={(v) => setForm((p) => ({ ...p, skills: v }))} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Candidate Image</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setCandidateImageFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus_field"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Resume (PDF/DOC/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus_field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Professional Summary</label>
                <textarea
                  value={form.about}
                  onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus_field h-28"
                />
              </div>

              <button disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <Info label="Email" value={form.email} icon={<Mail size={16} />} />
            <Info label="Phone" value={form.phone} icon={<Phone size={16} />} />
            <Info label="Location" value={form.location} icon={<MapPin size={16} />} />
            <Info label="Role" value={form.title} icon={<User size={16} />} />
            <Info label="Experience" value={form.experienceLevel} icon={<BriefcaseBusiness size={16} />} />
            <Info label="Education" value={form.education} icon={<GraduationCap size={16} />} />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Resume</h4>
            {form.resumeUrl ? (
              <a
                href={toAssetUrl(form.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                View Uploaded Resume
              </a>
            ) : (
              <p className="text-sm text-gray-500">No resume uploaded</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Professional Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skillsList.length === 0 && <p className="text-sm text-gray-500">No skills added</p>}
              {skillsList.map((skill) => (
                <span key={skill} className="text-xs bg-gray-100 text-gray-700 rounded-md px-3 py-1.5">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="">
            
            <button
              onClick={deleteCandidateAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus_field" />
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

export default UserProfile;
