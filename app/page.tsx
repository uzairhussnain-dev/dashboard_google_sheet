"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    if (!document.querySelector('#font-awesome-cdn')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(link);
    }


    fetch("/api/users")
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user[1]?.toLowerCase().includes(searchLower) || // name
      user[2]?.toLowerCase().includes(searchLower) || // email
      user[0]?.toLowerCase().includes(searchLower)    // id
    );
  });

  // Calculate active users (assuming user[3] is status, if not, default to all active)
  const activeUsers = users.filter(user => user[3] !== 'inactive').length;

  return (
    <div className="dashboard-container">
      {/* Background blur elements for depth */}
      <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>
      <div className="bg-blur-3"></div>

      {/* Main content */}
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="title-area">
            <div className="icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h1>Team Members</h1>
              <p>Manage and view all registered users</p>
            </div>
          </div>
          
          {/* Stats Cards - Simplified */}
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{users.length}</h3>
                <span>Total Users</span>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info">
                <h3>{activeUsers}</h3>
                <span>Active Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-section glass">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="clear-btn">
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className="filter-badge">
            <i className="fas fa-sliders-h"></i>
            <span>All users</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container glass">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading team data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <h3>No users found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="user-table">
                <thead>
                  <tr>
                    <th><i className="fas fa-hashtag"></i> ID</th>
                    <th><i className="fas fa-user"></i> Name</th>
                    <th><i className="fas fa-envelope"></i> Email</th>
                    <th><i className="fas fa-circle"></i> Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr key={i} className="table-row">
                      <td className="user-id">
                        <span className="id-badge">
                          <i className="fas fa-id-card"></i>
                          #{user[0]?.slice(0, 8)}
                        </span>
                      </td>
                      <td className="user-name">
                        <span>
                          <i className="fas fa-user-circle"></i>
                          {user[1]}
                        </span>
                      </td>
                      <td className="user-status">
                        <span className={`status-badge ${user[3] === 'inactive' ? 'status-inactive' : 'status-active'}`}>
                          <span className="status-dot"></span>
                          <i className={`fas ${user[3] === 'inactive' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                          {user[2]}
                        </span>
                      </td>
                      <td className="user-actions">
                        <button className="action-btn" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="action-btn" title="Edit User">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn" title="More Options">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Table Footer */}
          {!loading && filteredUsers.length > 0 && (
            <div className="table-footer">
              <div className="footer-info">
                <i className="fas fa-chart-simple"></i>
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="pagination">
                <button className="page-btn" disabled>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          padding: 2rem;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Animated background blurs */
        .bg-blur-1, .bg-blur-2, .bg-blur-3 {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          z-index: 0;
          pointer-events: none;
        }

        .bg-blur-1 {
          width: 500px;
          height: 500px;
          background: rgba(255, 107, 107, 0.3);
          top: -100px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .bg-blur-2 {
          width: 600px;
          height: 600px;
          background: rgba(78, 205, 196, 0.3);
          bottom: -150px;
          left: -150px;
          animation: float 25s ease-in-out infinite reverse;
        }

        .bg-blur-3 {
          width: 400px;
          height: 400px;
          background: rgba(255, 186, 8, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header Section */
        .header-section {
          margin-bottom: 2rem;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .icon-badge {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .title-area h1 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }

        .title-area p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        /* Stats Grid - Simplified */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          max-width: 600px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: white;
        }

        .stat-info h3 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .stat-info span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Search Section */
        .search-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .search-wrapper {
          flex: 1;
          position: relative;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .clear-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: color 0.2s;
        }

        .clear-btn:hover {
          color: white;
        }

        .filter-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-badge:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Table Container */
        .table-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table thead {
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-table th {
          text-align: left;
          padding: 1.25rem 1rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-table th i {
          margin-right: 0.5rem;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-table td {
          padding: 1rem;
          color: white;
        }

        .user-id .id-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: monospace;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.35rem 0.75rem;
          border-radius: 10px;
        }

        .user-id .id-badge i {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-name span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-name span i {
          opacity: 0.7;
          font-size: 0.85rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          color: white;
        }

        .user-email {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-email i {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .user-email a {
          color: white;
          text-decoration: none;
          transition: color 0.2s;
        }

        .user-email a:hover {
          color: #a0a0ff;
          text-decoration: underline;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge i {
          font-size: 0.7rem;
        }

        .status-active {
          background: rgba(72, 187, 120, 0.2);
          color: #9ae6b4;
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .status-inactive {
          background: rgba(245, 101, 101, 0.2);
          color: #feb2b2;
          border: 1px solid rgba(245, 101, 101, 0.3);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .user-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          padding: 0.5rem;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        /* Table Footer */
        .table-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-info {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-info i {
          font-size: 0.8rem;
        }

        .pagination {
          display: flex;
          gap: 0.5rem;
        }

        .page-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .page-btn.active {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Loading & Empty States */
        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: white;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 1rem;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state i {
          font-size: 4rem;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          opacity: 0.7;
        }

        /* Glass effect common */
        .glass {
          backdrop-filter: blur(12px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .title-area h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            max-width: 100%;
          }

          .user-table th, .user-table td {
            padding: 0.75rem;
          }

          .user-actions {
            flex-wrap: wrap;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}