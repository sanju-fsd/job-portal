import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Camera
} from "lucide-react";

const EmployerProfilePage = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    about: "",
    location: "",
    phone: "",
    website: "",
    size: "",
    founded: "",
  });

  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      companyName: user.companyName || "",
      about: user.about || "",
      location: user.location || "",
      phone: user.phone || "",
      website: user.website || "",
      size: user.size || "",
      founded: user.founded || "",
    });

    if (user.profileImageUrl) {
      setPreview(`https://job-portal-1hxq.onrender.com${user.profileImageUrl}`);
    }
  }, [user]);

  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

const submit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    setSaving(true);
    const { data: updatedUser } = await axios.put(API_PATHS.USERS.UPDATE, form);
    let finalUser = updatedUser;

    if (image) {
      const formData = new FormData();
      formData.append("profileImage", image);

      const { data } = await axios.post(API_PATHS.USERS.UPLOAD_EMPLOYER_LOGO, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      finalUser = data;
    }

    setUser(finalUser);
    setForm({
      name: finalUser.name || "",
      email: finalUser.email || "",
      companyName: finalUser.companyName || "",
      about: finalUser.about || "",
      location: finalUser.location || "",
      phone: finalUser.phone || "",
      website: finalUser.website || "",
      size: finalUser.size || "",
      founded: finalUser.founded || "",
    });
    setImage(null);
    setEditing(false);
    setMessage("Company profile updated");
  } catch (err) {
    setMessage(err?.response?.data?.message || "Update failed");
  } finally {
    setSaving(false);
  }
};

  return (
    <DashboardLayout role="employer">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">

          {/* Company Logo */}
          <div className="relative w-20 h-20">

            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="company"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-600">
                  {(form.companyName || form.name || "C").charAt(0)}
                </span>
              )}
            </div>

            {editing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer "
                />

                <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full">
                  <Camera size={14} />
                </div>
              </>
            )}
          </div>

          {/* Company Info */}
          <div>
            <h2 className="text-xl font-semibold">
              {form.companyName || "Company Name"}
            </h2>

            <div className="text-gray-500 text-sm flex gap-4 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 size={14} /> {form.name || "Employer"}
              </span>

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
          onClick={() => setEditing((p) => !p)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6 items-start">

        {/* About Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">About Company</h3>

          {!editing ? (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {form.about || "No company description added yet."}
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, companyName: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Contact Person"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                   className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Company Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                   className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Website"
                  value={form.website}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, website: e.target.value }))
                  }
                   className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />
              </div>

              <textarea
                rows={8}
                value={form.about}
                onChange={(e) =>
                  setForm((p) => ({ ...p, about: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2 focus_field border-gray-200"
                placeholder="Write about your company..."
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Company Size"
                  value={form.size}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, size: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />

                <input
                  placeholder="Founded (e.g. 2012)"
                  value={form.founded}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, founded: e.target.value }))
                  }
                  className="border rounded-lg px-3 py-2 focus_field border-gray-200"
                />
              </div>

              <button
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {message && (
                <p className="text-sm text-gray-500">{message}</p>
              )}
            </form>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4 h-fit">
          <Info label="Email" value={form.email} icon={<Mail size={16} />} />
          <Info label="Phone" value={form.phone} icon={<Phone size={16} />} />
          <Info label="Location" value={form.location} icon={<MapPin size={16} />} />
          <Info label="Website" value={form.website} icon={<Globe size={16} />} />
          <Info label="Company Size" value={form.size} />
          <Info label="Founded" value={form.founded} />
        </div>

      </div>
    </DashboardLayout>
  );
};

const Info = ({ label, value, icon }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500 flex items-center gap-1">
      {icon} {label}
    </span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);

export default EmployerProfilePage;
