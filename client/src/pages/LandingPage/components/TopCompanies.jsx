import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { MapPin } from "lucide-react";

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await axios.get("/companies");
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Top Company Registered</h2>
          <p className="text-gray-500">
            Some of the companies we've helped recruit applicants.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.slice(0, 4).map((company) => (
          <div
            key={company._id}
            className="bg-white border rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 mx-auto rounded-full object-cover"
            />

            <h3 className="mt-4 font-semibold text-lg">
              {company.name}
            </h3>

            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-2">
              <MapPin size={14} />
              {company.location}
            </div>

            <button className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
              Open Jobs - {company.openJobs}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCompanies;