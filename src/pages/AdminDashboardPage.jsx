import React, { useState, useEffect } from 'react';
import { FiUsers, FiFileText, FiTag, FiStar, FiClock, FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import RouteGuard from '../components/RouteGuard';
import useAuthStore from '../stores/authStore';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { formatDate } from '../utils';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedAuth = localStorage.getItem('writespace_auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.state?.user) {
            setUsers([authData.state.user]);
          }
        }

        const storedDocuments = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
        if (storedDocuments) {
          const docs = JSON.parse(storedDocuments);
          setDocuments(docs);

          const allPosts = docs.flatMap(doc => doc.posts || []);
          setPosts(allPosts.map(post => ({
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          })));
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      return sortDirection === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'updatedAt') {
      return sortDirection === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    } else {
      return sortDirection === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    setShowSortDropdown(false);
  };

  const renderUsersTable = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      size="small"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="small">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedUsers.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No users found
        </div>
      )}
    </div>
  );

  const renderDocumentsTable = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags && doc.tags.length > 0 ? (
                      doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No tags</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(doc.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(doc.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="small">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedDocuments.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No documents found
        </div>
      )}
    </div>
  );

  const renderPostsTable = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPosts.map((post) => {
              const document = documents.find(doc => doc.id === post.documentId);
              return (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.isFavorite && (
                        <FiStar className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {document ? document.title : 'Unknown Document'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.length > 0 ? (
                        post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="small">
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sortedPosts.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No posts found
        </div>
      )}
    </div>
  );

  const getStats = () => {
    const totalDocuments = documents.length;
    const totalPosts = posts.length;
    const totalTags = documents.reduce((acc, doc) => acc + (doc.tags ? doc.tags.length : 0), 0) +
                      posts.reduce((acc, post) => acc + post.tags.length, 0);
    const totalFavorites = posts.filter(post => post.isFavorite).length;

    return [
      {
        name: 'Total Users',
        value: users.length,
        icon: <FiUsers className="h-6 w-6" />,
      },
      {
        name: 'Total Documents',
        value: totalDocuments,
        icon: <FiFileText className="h-6 w-6" />,
      },
      {
        name: 'Total Posts',
        value: totalPosts,
        icon: <FiFileText className="h-6 w-6" />,
      },
      {
        name: 'Total Tags',
        value: totalTags,
        icon: <FiTag className="h-6 w-6" />,
      },
      {
        name: 'Favorite Posts',
        value: totalFavorites,
        icon: <FiStar className="h-6 w-6" />,
      },
      {
        name: 'Recent Activity',
        value: formatDate(posts.length > 0 ? Math.max(...posts.map(p => new Date(p.updatedAt).getTime())) : new Date()),
        icon: <FiClock className="h-6 w-6" />,
      },
    ];
  };

  const stats = getStats();

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Overview and management of {user?.name || 'admin'} workspace
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      {React.cloneElement(stat.icon, { className: 'h-6 w-6 text-white' })}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  fullWidth
                  size="medium"
                  variant="outline"
                  className="pl-10"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full sm:w-auto"
                  >
                    <FiFilter className="mr-2" />
                    Sort: {sortBy === 'title' ? 'Title' : sortBy === 'createdAt' ? 'Created' : 'Updated'}
                    {sortDirection === 'asc' ? (
                      <FiChevronUp className="ml-2" />
                    ) : (
                      <FiChevronDown className="ml-2" />
                    )}
                  </Button>

                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleSortChange('title')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Title
                        </button>
                        <button
                          onClick={() => handleSortChange('createdAt')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Created Date
                        </button>
                        {activeTab === 'posts' && (
                          <button
                            onClick={() => handleSortChange('updatedAt')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Updated Date
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'users' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'documents' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'posts' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Posts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'users' && renderUsersTable()}
              {activeTab === 'documents' && renderDocumentsTable()}
              {activeTab === 'posts' && renderPostsTable()}
            </>
          )}
        </div>
      </div>
    </RouteGuard>
  );
};

export default AdminDashboardPage;