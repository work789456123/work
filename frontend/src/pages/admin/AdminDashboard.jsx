import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  return (

    <div className="flex flex-col w-full h-screen bg-gray-50">

      {/* Top Navbar */}

      <header className="h-16 border-b bg-teal-50 px-8 flex items-center justify-between">

        <input
          type="text"
          placeholder="Search animals, farmers, or alerts..."
          className="w-96 px-4 py-2 bg-gray-100 rounded-lg outline-none"
        />

        <div className="flex items-center gap-6">

          <span className="font-semibold">
            Dr. Rajesh Kumar
          </span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </header>


      {/* Dashboard Body */}

      <div className="flex-1 overflow-y-auto p-8">

        {/* Title */}

        <div className="flex justify-between items-end mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Dashboard Overview
            </h1>

            <p className="text-gray-500">
              Real-time health monitoring powered by Gopu AI
            </p>

          </div>

          <div className="flex gap-3">

            <button className="bg-teal-50 border px-4 py-2 rounded-lg text-sm">
              Last 30 Days
            </button>

            <button className="bg-teal-50 border px-4 py-2 rounded-lg text-sm">
              Export
            </button>

          </div>

        </div>


        {/* Stats Cards */}

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-teal-50 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Animals</p>
            <h2 className="text-2xl font-bold">12,840</h2>
          </div>

          <div className="bg-teal-50 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Active Alerts</p>
            <h2 className="text-2xl font-bold">24</h2>
          </div>

          <div className="bg-teal-50 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Recent Consultations</p>
            <h2 className="text-2xl font-bold">156</h2>
          </div>

          <div className="bg-teal-50 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Verified Farmers</p>
            <h2 className="text-2xl font-bold">3420</h2>
          </div>

        </div>


        {/* Charts + Alerts */}

        <div className="grid grid-cols-3 gap-8 mb-8">

          {/* Chart */}

          <div className="col-span-2 bg-teal-50 p-8 rounded-xl shadow-sm">

            <h3 className="font-bold mb-6">
              Health Trends & AI Insights
            </h3>

            <div className="flex items-end gap-2 h-56">

              <div className="bg-green-200 w-full h-24 rounded"></div>
              <div className="bg-green-300 w-full h-36 rounded"></div>
              <div className="bg-green-400 w-full h-28 rounded"></div>
              <div className="bg-green-200 w-full h-40 rounded"></div>
              <div className="bg-green-600 w-full h-52 rounded"></div>
              <div className="bg-green-300 w-full h-32 rounded"></div>
              <div className="bg-green-200 w-full h-20 rounded"></div>
              <div className="bg-green-500 w-full h-36 rounded"></div>
              <div className="bg-green-200 w-full h-24 rounded"></div>
              <div className="bg-green-400 w-full h-44 rounded"></div>

            </div>

          </div>


          {/* Alerts Panel */}

          <div className="bg-teal-50 p-8 rounded-xl shadow-sm">

            <h3 className="font-bold mb-6">
              Critical AI Alerts
            </h3>

            <div className="space-y-6">

              <div>

                <p className="font-semibold">
                  Lumpy Skin Detection
                </p>

                <p className="text-sm text-gray-500">
                  Farmer: Ram Singh
                </p>

                <span className="text-red-500 text-xs font-bold">
                  ACTION REQUIRED
                </span>

              </div>


              <div>

                <p className="font-semibold">
                  Abnormal Temperature
                </p>

                <p className="text-sm text-gray-500">
                  Cow - 88
                </p>

                <span className="text-yellow-500 text-xs font-bold">
                  MONITORING
                </span>

              </div>


              <div>

                <p className="font-semibold">
                  Feeding Pattern Shift
                </p>

                <p className="text-sm text-gray-500">
                  Possible Ketosis
                </p>

                <span className="text-green-600 text-xs font-bold">
                  VERIFIED
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Table */}

        <div className="bg-teal-50 rounded-xl shadow-sm">

          <div className="p-6 border-b flex justify-between">

            <h3 className="font-bold text-lg">
              Recent Consultations
            </h3>

            <button className="text-green-700 font-semibold">
              View History
            </button>

          </div>


          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4">Animal</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Symptom</th>
                <th className="p-4">AI Diagnosis</th>
                <th className="p-4">Status</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t">

                <td className="p-4">Jersey Cow</td>
                <td className="p-4">Amit Verma</td>
                <td className="p-4">Reduced milk</td>
                <td className="p-4 text-blue-600">
                  Mastitis Risk
                </td>
                <td className="p-4 text-green-600">
                  Active
                </td>

              </tr>


              <tr className="border-t">

                <td className="p-4">Beetal Goat</td>
                <td className="p-4">Sunita Devi</td>
                <td className="p-4">Loss of appetite</td>
                <td className="p-4">
                  Nutritional Gap
                </td>
                <td className="p-4 text-gray-500">
                  Resolved
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}