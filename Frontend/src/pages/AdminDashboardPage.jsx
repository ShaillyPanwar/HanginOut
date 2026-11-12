import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import {
  Shield,
  Users,
  Compass,
  MapPin,
  Layers,
  Heart,
  Calendar,
  MessageSquare,
  Star,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  X,
  Sliders,
  UserCheck,
  UserX,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [spots, setSpots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    minCost: 0,
    maxCost: 500,
    durationMinutes: 60,
    bestTime: 'Evening',
    locationType: 'Indoor',
    groupType: 'Friends',
    city: 'Delhi',
    coverImageUrl: '',
    isActive: true,
  });

  const [showSpotModal, setShowSpotModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [spotForm, setSpotForm] = useState({
    name: '',
    description: '',
    address: '',
    city: 'Delhi',
    minCost: 0,
    maxCost: 300,
    openingHours: '10:00 AM - 10:00 PM',
    coverImageUrl: '',
    isActive: true,
  });

  const [spotImageUploading, setSpotImageUploading] = useState(false);
  const [spotUploadError, setSpotUploadError] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    iconName: 'tag',
  });

  // Fetch data on tab switch
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'analytics') {
        const res = await adminService.getAnalytics();
        setAnalytics(res.data);
      } else if (tab === 'activities') {
        const [actRes, catRes, spotRes] = await Promise.all([
          adminService.getActivities({ size: 50 }),
          adminService.getCategories(),
          adminService.getSpots({ size: 100 }),
        ]);
        setActivities(actRes.data.content || []);
        setCategories(catRes.data || []);
        setSpots(spotRes.data.content || []);
      } else if (tab === 'spots') {
        const res = await adminService.getSpots({ size: 50 });
        setSpots(res.data.content || []);
      } else if (tab === 'categories') {
        const res = await adminService.getCategories();
        setCategories(res.data || []);
      } else if (tab === 'users') {
        const res = await adminService.getUsers({ search: userSearch, size: 50 });
        setUsers(res.data.content || []);
      } else if (tab === 'feedback') {
        const res = await adminService.getFeedback({ size: 50 });
        setFeedback(res.data.content || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data for ' + tab);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // --- USER ACTIONS ---
  const handleToggleUserStatus = async (targetUser) => {
    if (targetUser.id === user.id) {
      setError('You cannot deactivate your own administrator account');
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      await adminService.updateUserStatus(targetUser.id, !targetUser.active);
      showNotification(`User ${targetUser.email} status updated`);
      loadTabData('users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    if (targetUser.id === user.id && newRole !== 'ROLE_ADMIN') {
      setError('You cannot demote your own administrator account');
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      await adminService.updateUserRole(targetUser.id, newRole);
      showNotification(`User ${targetUser.email} role updated to ${newRole}`);
      loadTabData('users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  // --- ACTIVITY ACTIONS ---
  const openCreateActivityModal = () => {
    setEditingActivity(null);
    setActivityForm({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      minCost: 0,
      maxCost: 500,
      durationMinutes: 60,
      bestTime: 'Evening',
      locationType: 'Indoor',
      groupType: 'Friends',
      city: 'Delhi',
      coverImageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    });
    setShowActivityModal(true);
  };

  const openEditActivityModal = (act) => {
    setEditingActivity(act);
    setActivityForm({
      title: act.title,
      description: act.description,
      categoryId: act.categoryId || '',
      minCost: act.minCost,
      maxCost: act.maxCost,
      durationMinutes: act.durationMinutes,
      bestTime: act.bestTime || 'Evening',
      locationType: act.locationType || 'Indoor',
      groupType: act.groupType || 'Friends',
      city: act.city || 'Delhi',
      coverImageUrl: act.coverImageUrl || '',
      isActive: act.active,
    });
    setShowActivityModal(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      if (editingActivity) {
        const res = await adminService.updateActivity(editingActivity.id, activityForm);
        const updated = res.data;
        setActivities((prev) => prev.map((a) => (a.id === editingActivity.id ? (updated || { ...a, ...activityForm }) : a)));
        showNotification('Activity updated successfully');
      } else {
        const res = await adminService.createActivity(activityForm);
        const created = res.data;
        setActivities((prev) => [created || { ...activityForm, id: Date.now() }, ...prev]);
        showNotification('Activity created successfully');
      }
      setShowActivityModal(false);
      loadTabData('activities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete/deactivate this activity?')) return;
    setActionLoading(true);
    setError(null);
    try {
      await adminService.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      showNotification('Activity removed/deactivated');
      loadTabData('activities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete activity');
    } finally {
      setActionLoading(false);
    }
  };

  // --- SPOT ACTIONS ---
  const handleSpotImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please choose a smaller image.');
      return;
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));
    if (!isValid) {
      alert('Only JPG, JPEG, PNG, and WEBP image formats are supported.');
      return;
    }

    setSpotImageUploading(true);
    setSpotUploadError('');
    try {
      const res = await adminService.uploadSpotImage(file);
      if (res.data?.url) {
        setSpotForm((prev) => ({ ...prev, coverImageUrl: res.data.url }));
        showNotification('Spot image uploaded successfully from PC!');
      }
    } catch (err) {
      console.error('Spot image upload failed:', err);
      setSpotUploadError(err.response?.data?.message || 'Failed to upload spot image');
    } finally {
      setSpotImageUploading(false);
    }
  };

  const openCreateSpotModal = () => {
    setEditingSpot(null);
    setSpotForm({
      name: '',
      description: '',
      address: '',
      city: 'Delhi',
      minCost: 0,
      maxCost: 300,
      openingHours: '10:00 AM - 10:00 PM',
      coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    });
    setSpotUploadError('');
    setShowSpotModal(true);
  };

  const openEditSpotModal = (spot) => {
    setEditingSpot(spot);
    setSpotForm({
      name: spot.name,
      description: spot.description || '',
      address: spot.address,
      city: spot.city,
      minCost: spot.minCost,
      maxCost: spot.maxCost,
      openingHours: spot.openingHours || '',
      coverImageUrl: spot.coverImageUrl || '',
      isActive: spot.active,
    });
    setSpotUploadError('');
    setShowSpotModal(true);
  };

  const handleSaveSpot = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      if (editingSpot) {
        const res = await adminService.updateSpot(editingSpot.id, spotForm);
        const updated = res.data;
        setSpots((prev) => prev.map((s) => (s.id === editingSpot.id ? (updated || { ...s, ...spotForm }) : s)));
        showNotification('Spot updated successfully');
      } else {
        const res = await adminService.createSpot(spotForm);
        const created = res.data;
        setSpots((prev) => [created || { ...spotForm, id: Date.now() }, ...prev]);
        showNotification('Spot created successfully');
      }
      setShowSpotModal(false);
      loadTabData('spots');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save spot');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSpot = async (id) => {
    if (!window.confirm('Are you sure you want to remove this physical spot?')) return;
    setActionLoading(true);
    setError(null);
    try {
      await adminService.deleteSpot(id);
      setSpots((prev) => prev.filter((s) => s.id !== id));
      showNotification('Spot removed');
      loadTabData('spots');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete spot');
    } finally {
      setActionLoading(false);
    }
  };

  // --- CATEGORY ACTIONS ---
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', iconName: 'compass' });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || '',
      iconName: cat.iconName || 'compass',
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      if (editingCategory) {
        const res = await adminService.updateCategory(editingCategory.id, categoryForm);
        const updated = res.data;
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? (updated || { ...c, ...categoryForm }) : c)));
        showNotification('Category updated successfully');
      } else {
        const res = await adminService.createCategory(categoryForm);
        const created = res.data;
        setCategories((prev) => [created || { ...categoryForm, id: Date.now() }, ...prev]);
        showNotification('Category created successfully');
      }
      setShowCategoryModal(false);
      loadTabData('categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setActionLoading(true);
    setError(null);
    try {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showNotification('Category deleted');
      loadTabData('categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Return to Student Platform"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">HanginOut <span className="text-purple-400">Admin</span></span>
                <span className="ml-2 text-xs text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user?.name}</div>
              <div className="text-[11px] text-purple-400 font-mono">{user?.role}</div>
            </div>
            <button
              onClick={() => loadTabData(activeTab)}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
              title="Refresh Current View"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto border-t border-slate-800/60 scrollbar-none">
          {[
            { id: 'analytics', label: 'Analytics', icon: Sliders },
            { id: 'activities', label: 'Activities', icon: Compass },
            { id: 'spots', label: 'Hangout Spots', icon: MapPin },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'feedback', label: 'User Feedback', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-red-400 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* --- TAB 1: ANALYTICS OVERVIEW --- */}
        {activeTab === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
                <p className="text-sm text-slate-400">Live platform totals across all user, content, and engagement domains.</p>
              </div>
            </div>

            {loading && !analytics ? (
              <div className="py-20 text-center text-slate-500">Loading platform metrics...</div>
            ) : analytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Total Users</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalUsers}</div>
                    <div className="text-xs text-emerald-400 mt-1">{analytics.activeUsers} active accounts</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Activities</span>
                      <Compass className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalActivities}</div>
                    <div className="text-xs text-orange-400 mt-1">{analytics.activeActivities} active in deck</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Hangout Spots</span>
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalSpots}</div>
                    <div className="text-xs text-slate-400 mt-1">Physical locations</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Categories</span>
                      <Layers className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalCategories}</div>
                    <div className="text-xs text-slate-400 mt-1">Activity classifications</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Student Groups</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalGroups}</div>
                    <div className="text-xs text-slate-400 mt-1">Collaborative groups</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Total Swipes</span>
                      <Heart className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalSwipes}</div>
                    <div className="text-xs text-slate-400 mt-1">Solo & Group votes</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Hangout Plans</span>
                      <Calendar className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{analytics.totalPlans}</div>
                    <div className="text-xs text-slate-400 mt-1">Locked schedules</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Feedback Rating</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white flex items-center gap-1.5">
                      <span>{analytics.averageRating}</span>
                      <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                    </div>
                    <div className="text-xs text-yellow-400 mt-1">{analytics.totalFeedback} reviews recorded</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">Security & Architecture Status</h3>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• Spring Security 6 Role-Based Access Control enforced on backend (`ROLE_ADMIN`).</p>
                    <p>• Profile-update endpoints strictly prohibited from role mutations (escalation mitigation).</p>
                    <p>• Administrative bootstrapping configured with zero hardcoded default credentials.</p>
                    <p>• Administrator self-demotion and self-deactivation protection active.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* --- TAB 2: ACTIVITIES MANAGEMENT --- */}
        {activeTab === 'activities' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Activities Management</h1>
                <p className="text-sm text-slate-400">Create, edit, and curate activities shown to students in recommendation swipe decks.</p>
              </div>
              <button
                onClick={openCreateActivityModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Activity</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Budget Range</th>
                    <th className="py-3.5 px-4">Duration & Mode</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {act.coverImageUrl ? (
                            <img src={act.coverImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600">
                              <Compass className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{act.title}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{act.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">{act.categoryName || 'General'}</td>
                      <td className="py-3 px-4 font-mono">₹{act.minCost} - ₹{act.maxCost}</td>
                      <td className="py-3 px-4">
                        <div>{act.durationMinutes} mins</div>
                        <div className="text-[11px] text-slate-500">{act.locationType} • {act.groupType}</div>
                      </td>
                      <td className="py-3 px-4">{act.city}</td>
                      <td className="py-3 px-4">
                        {act.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-[11px] font-semibold">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditActivityModal(act)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                            title="Edit Activity"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: SPOTS MANAGEMENT --- */}
        {activeTab === 'spots' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Hangout Spots Management</h1>
                <p className="text-sm text-slate-400">Physical venues, cafes, parks, and venues linked with hangout activities.</p>
              </div>
              <button
                onClick={openCreateSpotModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spot</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Spot Name</th>
                    <th className="py-3.5 px-4">Address & City</th>
                    <th className="py-3.5 px-4">Cost Range</th>
                    <th className="py-3.5 px-4">Opening Hours</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {spots.map((spot) => (
                    <tr key={spot.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white">{spot.name}</td>
                      <td className="py-3 px-4">
                        <div>{spot.address}</div>
                        <div className="text-[11px] text-slate-400">{spot.city}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">₹{spot.minCost} - ₹{spot.maxCost}</td>
                      <td className="py-3 px-4">{spot.openingHours || 'Standard hours'}</td>
                      <td className="py-3 px-4">
                        {spot.active ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-[11px] font-semibold">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditSpotModal(spot)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                            title="Edit Spot"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpot(spot.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                            title="Delete Spot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 4: CATEGORIES MANAGEMENT --- */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Categories Management</h1>
                <p className="text-sm text-slate-400">Classifications for hangout experiences (e.g. Street Food, Board Games, Bowling).</p>
              </div>
              <button
                onClick={openCreateCategoryModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-white">{cat.name}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {cat.iconName || 'tag'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{cat.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 5: USERS & ROLES --- */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Users & Roles Management</h1>
                <p className="text-sm text-slate-400">View student accounts, promote/demote administrator privileges, and toggle active status.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadTabData('users')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() => loadTabData('users')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">City & Age</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => {
                    const isSelf = u.id === user.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-normal">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{u.city || 'Not set'}</div>
                          <div className="text-[11px] text-slate-500">{u.age ? `${u.age} yrs` : 'Age N/A'}</div>
                        </td>
                        <td className="py-3 px-4">
                          {u.role === 'ROLE_ADMIN' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold text-[11px]">
                              ROLE_ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px]">
                              ROLE_USER
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {u.active ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Deactivated</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleToggleUserRole(u)}
                              disabled={actionLoading || (isSelf && u.role === 'ROLE_ADMIN')}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                                u.role === 'ROLE_ADMIN'
                                  ? 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                                  : 'border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={isSelf ? 'Cannot demote self' : 'Toggle User/Admin Role'}
                            >
                              {u.role === 'ROLE_ADMIN' ? 'Demote to User' : 'Make Admin'}
                            </button>

                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              disabled={actionLoading || isSelf}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                                u.active
                                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={isSelf ? 'Cannot deactivate self' : 'Toggle Active/Inactive'}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 6: FEEDBACK REVIEWS --- */}
        {activeTab === 'feedback' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Student Feedback Reviews</h1>
                <p className="text-sm text-slate-400">Post-hangout ratings and comments submitted by student groups.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Activity</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Enjoyed</th>
                    <th className="py-3.5 px-4">Comment</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {feedback.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No user feedback recorded yet.
                      </td>
                    </tr>
                  ) : (
                    feedback.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{item.userName || 'Anonymous'}</div>
                          <div className="text-[11px] text-slate-400">{item.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {item.activityTitle || `Activity #${item.activityId}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-yellow-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {item.enjoyed ? (
                            <span className="text-emerald-400 font-semibold">Yes</span>
                          ) : (
                            <span className="text-slate-500 font-semibold">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <p className="text-slate-300 italic line-clamp-2">{item.comment || 'No comment left'}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: ACTIVITY CREATE / EDIT --- */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingActivity ? 'Edit Activity' : 'Create New Activity'}
              </h2>
              <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g. Midnight Bowling Tournament"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="Describe the student experience, vibe, and amenities..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={activityForm.categoryId}
                    onChange={(e) => setActivityForm({ ...activityForm, categoryId: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={activityForm.city}
                    onChange={(e) => setActivityForm({ ...activityForm, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Cost (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={activityForm.minCost}
                    onChange={(e) => setActivityForm({ ...activityForm, minCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Cost (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={activityForm.maxCost}
                    onChange={(e) => setActivityForm({ ...activityForm, maxCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    min="15"
                    required
                    value={activityForm.durationMinutes}
                    onChange={(e) => setActivityForm({ ...activityForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location Type</label>
                  <select
                    value={activityForm.locationType}
                    onChange={(e) => setActivityForm({ ...activityForm, locationType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Group Type</label>
                  <select
                    value={activityForm.groupType}
                    onChange={(e) => setActivityForm({ ...activityForm, groupType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Friends">Friends</option>
                    <option value="Solo">Solo</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Best Time</label>
                  <input
                    type="text"
                    value={activityForm.bestTime}
                    onChange={(e) => setActivityForm({ ...activityForm, bestTime: e.target.value })}
                    placeholder="e.g. Evening, Night"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={activityForm.coverImageUrl}
                  onChange={(e) => setActivityForm({ ...activityForm, coverImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="actActive"
                  checked={activityForm.isActive}
                  onChange={(e) => setActivityForm({ ...activityForm, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-800"
                />
                <label htmlFor="actActive" className="text-slate-300 font-medium cursor-pointer">
                  Active (visible in swipe recommendations)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: SPOT CREATE / EDIT --- */}
      {showSpotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingSpot ? 'Edit Spot' : 'Add Physical Spot'}
              </h2>
              <button onClick={() => setShowSpotModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpot} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Spot Name *</label>
                <input
                  type="text"
                  required
                  value={spotForm.name}
                  onChange={(e) => setSpotForm({ ...spotForm, name: e.target.value })}
                  placeholder="e.g. Smash Bowling Lounge"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={spotForm.description}
                  onChange={(e) => setSpotForm({ ...spotForm, description: e.target.value })}
                  placeholder="Venue details, vibe..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={spotForm.address}
                  onChange={(e) => setSpotForm({ ...spotForm, address: e.target.value })}
                  placeholder="e.g. DLF CyberHub, Phase 2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={spotForm.city}
                    onChange={(e) => setSpotForm({ ...spotForm, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={spotForm.openingHours}
                    onChange={(e) => setSpotForm({ ...spotForm, openingHours: e.target.value })}
                    placeholder="10:00 AM - 11:00 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={spotForm.minCost}
                    onChange={(e) => setSpotForm({ ...spotForm, minCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={spotForm.maxCost}
                    onChange={(e) => setSpotForm({ ...spotForm, maxCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Spot Cover Image</span>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 5MB)</span>
                </label>

                {/* Image Preview & Actions */}
                {spotForm.coverImageUrl ? (
                  <div className="mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <img
                      src={spotForm.coverImageUrl}
                      alt="Spot Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-300 font-mono truncate">{spotForm.coverImageUrl}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="cursor-pointer text-[11px] font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Replace File</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleSpotImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setSpotForm({ ...spotForm, coverImageUrl: '' })}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950 hover:bg-slate-900 transition">
                      <Upload className="w-6 h-6 text-purple-400 mb-2" />
                      <span className="text-xs font-semibold text-white">Select Spot Image from PC</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, or WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleSpotImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {spotImageUploading && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading image from PC to server...</span>
                  </div>
                )}

                {spotUploadError && (
                  <div className="text-xs text-rose-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{spotUploadError}</span>
                  </div>
                )}

                <div className="mt-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Or direct image URL fallback:</label>
                  <input
                    type="url"
                    value={spotForm.coverImageUrl}
                    onChange={(e) => setSpotForm({ ...spotForm, coverImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /uploads/spots/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="spotActive"
                  checked={spotForm.isActive}
                  onChange={(e) => setSpotForm({ ...spotForm, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-800"
                />
                <label htmlFor="spotActive" className="text-slate-300 font-medium cursor-pointer">
                  Active spot
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CATEGORY CREATE / EDIT --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Board Games & Puzzles"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Icon Name</label>
                <input
                  type="text"
                  value={categoryForm.iconName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, iconName: e.target.value })}
                  placeholder="e.g. coffee, game-controller, dice"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
