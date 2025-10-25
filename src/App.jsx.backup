import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Package, Clock, CheckCircle, Trash2, Edit, X, TrendingUp, Calendar, AlertCircle, LogOut, Users, Eye, EyeOff, Shield, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://pzailvvjosssdluuabaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YWlsdnZqb3Nzc2RsdXVhYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTMzNDIsImV4cCI6MjA3NjU2OTM0Mn0.5gfX3gevuD1Q7a9AhYB7i03Rp3e79s0HrrYowWy8Y38';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// COMPOSANT: Page de Connexion
// ============================================
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appeler la fonction PostgreSQL
      const { data, error: rpcError } = await supabase
        .rpc('verify_user_password', {
          p_username: username,
          p_password: password
        });

      if (rpcError) throw rpcError;

      if (!data || data.length === 0 || !data[0].is_valid) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setLoading(false);
        return;
      }

      const user = data[0];
      const userData = {
        id: user.user_id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <Package size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Suivi des Commandes</h1>
          <p className="text-blue-100">Système de gestion</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          
        </form>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT: Gestion des Utilisateurs
// ============================================
const UserManagement = ({ currentUser, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user',
    full_name: '',
    email: ''
  });

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, username, role, full_name, email, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      alert('Nom d\'utilisateur et mot de passe requis');
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('create_user_with_password', {
          p_username: newUser.username,
          p_password: newUser.password,
          p_role: newUser.role,
          p_full_name: newUser.full_name || null,
          p_email: newUser.email || null
        });

      if (error) throw error;

      alert('Utilisateur créé avec succès !');
      setNewUser({ username: '', password: '', role: 'user', full_name: '', email: '' });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte !');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${username}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      alert('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3 text-white">
            <Users size={28} />
            <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{users.length} utilisateur(s)</p>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Nouvel utilisateur
            </button>
          </div>

          {showAddUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Créer un nouvel utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur *</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddUser}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Créer
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                        {user.full_name && <p className="text-sm text-gray-500">{user.full_name}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                        >
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT PRINCIPAL: Application
// ============================================
const OrderTrackingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    client: '',
  telephone: '',
  produit: '',
  prixAchatYuan: '',
  tauxChange: 85,
  prixVenteCFA: '',
  acompte: '',
  solde: '',
  dateExpedition: '',
  dateArriveePrevu: '',
  notes: ''
  });

  const statuts = ['Tous', 'Acompte en attente', 'Commandé', 'En transit', 'Arrivé', 'Livré'];

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur parsing user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Charger les commandes depuis Supabase
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date_commande', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const getStatutColor = (statut) => {
    const colors = {
      'Acompte en attente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Commandé': 'bg-blue-100 text-blue-800 border-blue-300',
      'En transit': 'bg-purple-100 text-purple-800 border-purple-300',
      'Arrivé': 'bg-green-100 text-green-800 border-green-300',
      'Livré': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatCFA = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatYuan = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' ¥';
  };

  const calculateFromYuan = (yuan, taux) => {
    return Math.round(parseFloat(yuan || 0) * parseFloat(taux || 85));
  };

const handleAddOrder = async () => {
  if (!newOrder.client || !newOrder.telephone || !newOrder.produit || !newOrder.prixVenteCFA) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  const prixVenteCFA = parseFloat(newOrder.prixVenteCFA);
  const prixAchatYuan = parseFloat(newOrder.prixAchatYuan) || 0;
  const tauxChange = parseFloat(newOrder.tauxChange) || 85;
  const acompte = newOrder.acompte ? parseFloat(newOrder.acompte) : Math.round(prixVenteCFA * 0.7);
  const solde = prixVenteCFA - acompte;
  
  const today = new Date().toISOString().split('T')[0];
  
  let dateArriveePrevu = newOrder.dateArriveePrevu;
  if (!dateArriveePrevu && newOrder.dateExpedition) {
    const expeditionDate = new Date(newOrder.dateExpedition);
    expeditionDate.setDate(expeditionDate.getDate() + 25);
    dateArriveePrevu = expeditionDate.toISOString().split('T')[0];
  } else if (!dateArriveePrevu) {
    const arriveeDans28Jours = new Date();
    arriveeDans28Jours.setDate(arriveeDans28Jours.getDate() + 28);
    dateArriveePrevu = arriveeDans28Jours.toISOString().split('T')[0];
  }

  const orderData = {
    date_commande: today,
    client: newOrder.client,
    telephone: newOrder.telephone,
    produit: newOrder.produit,
    prix_achat_yuan: prixAchatYuan,
    taux_change: tauxChange,
    prix_vente_cfa: prixVenteCFA,
    acompte: acompte,
    solde: solde,
    montant_paye: 0,
    montant_restant: prixVenteCFA,
    date_acompte: null,
    date_solde: null,
    date_expedition: newOrder.dateExpedition || null,
    date_arrivee_prevu: dateArriveePrevu,
    date_arrivee_effective: null,
    statut: 'Acompte en attente',
    notes: newOrder.notes || null
  };

  try {
    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) throw error;

    alert('Commande ajoutée avec succès!');
    fetchOrders();
    setNewOrder({
      client: '',
      telephone: '',
      produit: '',
      prixAchatYuan: '',
      tauxChange: 85,
      prixVenteCFA: '',
      acompte: '',
      solde: '',
      dateExpedition: '',
      dateArriveePrevu: '',
      notes: ''
    });
    setShowAddForm(false);
  } catch (error) {
    console.error('Erreur ajout commande:', error);
    alert('Erreur lors de l\'ajout de la commande');
  }
};

  const handleEditOrder = (order) => {
    setEditingOrder({...order});
    setShowEditForm(true);
  };

  const handleUpdateOrder = async () => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update(editingOrder)
        .eq('id', editingOrder.id);

      if (error) throw error;

      setShowEditForm(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteOrder = async () => {
    try {
      const { error } = await supabase
        .from('commandes')
        .delete()
        .eq('id', orderToDelete.id);

      if (error) throw error;

      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleStatutChange = async (orderId, newStatut) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut: newStatut })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatut = filterStatut === 'Tous' || order.statut === filterStatut;
    const matchesSearch = order.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.telephone?.includes(searchTerm);
    return matchesStatut && matchesSearch;
  });

  const calculateStats = () => {
    const total = filteredOrders.reduce((sum, order) => sum + (order.prix_vente_cfa || 0), 0);
    const paye = filteredOrders.reduce((sum, order) => sum + (order.montant_paye || 0), 0);
    const restant = filteredOrders.reduce((sum, order) => sum + (order.montant_restant || 0), 0);
    return { total, paye, restant, count: filteredOrders.length };
  };

  const stats = calculateStats();

  // Si pas connecté, afficher la page de connexion
  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Package className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Suivi des Commandes</h1>
                <p className="text-gray-600 mt-1">Bienvenue, {currentUser.full_name || currentUser.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowUserManagement(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Users size={20} />
                  <span className="hidden md:inline">Utilisateurs</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.count}</p>
              </div>
              <Package className="text-blue-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Chiffre d'Affaires</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCFA(stats.total)}</p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Montant Payé</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCFA(stats.paye)}</p>
              </div>
              <CheckCircle className="text-purple-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Reste à Payer</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCFA(stats.restant)}</p>
              </div>
              <DollarSign className="text-orange-500" size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et actions */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par client, produit ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                >
                  <Plus size={20} />
                  Nouvelle Commande
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{order.client}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatutColor(order.statut)}`}>
                        {order.statut}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{order.produit}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(order.date_commande).toLocaleDateString('fr-FR')}
                      </span>
                      <span>{order.telephone}</span>
                      {order.date_expedition && (
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          Expédition: {new Date(order.date_expedition).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">{formatCFA(order.prix_vente_cfa)}</p>
                      <p className="text-sm text-gray-600">Payé: {formatCFA(order.montant_paye)}</p>
                      {order.montant_restant > 0 && (
                        <p className="text-sm font-semibold text-orange-600">
                          Reste: {formatCFA(order.montant_restant)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    <select
                      value={order.statut}
                      onChange={(e) => handleStatutChange(order.id, e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuts.filter(s => s !== 'Tous').map(statut => (
                        <option key={statut} value={statut}>{statut}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      <Edit size={16} />
                      Modifier
                    </button>
                    <button
                      onClick={() => confirmDelete(order)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">Aucune commande trouvée</p>
              <p className="text-gray-500 text-sm mt-2">Ajustez vos filtres ou créez une nouvelle commande</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showUserManagement && (
        <UserManagement currentUser={currentUser} onClose={() => setShowUserManagement(false)} />
      )}

      {showAddForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold text-white">Nouvelle Commande</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/20 rounded-lg transition text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                  <input
                    type="text"
                    value={newOrder.client}
                    onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="text"
                    value={newOrder.telephone}
                    onChange={(e) => setNewOrder({...newOrder, telephone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit *</label>
                  <input
                    type="text"
                    value={newOrder.produit}
                    onChange={(e) => setNewOrder({...newOrder, produit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix Achat (¥)</label>
                  <input
                    type="number"
                    value={newOrder.prixAchatYuan}
                    onChange={(e) => {
                      const yuan = e.target.value;
                      setNewOrder({
                        ...newOrder,
                        prixAchatYuan: yuan,
                        prixVenteCFA: calculateFromYuan(yuan, newOrder.tauxChange)
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taux de Change</label>
                  <input
                    type="number"
                    value={newOrder.tauxChange}
                    onChange={(e) => {
                      const taux = e.target.value;
                      setNewOrder({
                        ...newOrder,
                        tauxChange: taux,
                        prixVenteCFA: calculateFromYuan(newOrder.prixAchatYuan, taux)
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix Vente (FCFA) *</label>
                  <input
                    type="number"
                    value={newOrder.prixVenteCFA}
                    onChange={(e) => setNewOrder({...newOrder, prixVenteCFA: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Expédition</label>
                  <input
                    type="date"
                    value={newOrder.dateExpedition}
                    onChange={(e) => setNewOrder({...newOrder, dateExpedition: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddOrder}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Ajouter la Commande
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditForm && editingOrder && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold text-white">Modifier la Commande</h2>
              <button onClick={() => setShowEditForm(false)} className="p-2 hover:bg-white/20 rounded-lg transition text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <input
                    type="text"
                    value={editingOrder.client}
                    onChange={(e) => setEditingOrder({...editingOrder, client: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="text"
                    value={editingOrder.telephone}
                    onChange={(e) => setEditingOrder({...editingOrder, telephone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
                  <input
                    type="text"
                    value={editingOrder.produit}
                    onChange={(e) => setEditingOrder({...editingOrder, produit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix Vente (FCFA)</label>
                  <input
                    type="number"
                    value={editingOrder.prix_vente_cfa}
                    onChange={(e) => setEditingOrder({...editingOrder, prix_vente_cfa: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant Payé</label>
                  <input
                    type="number"
                    value={editingOrder.montant_paye}
                    onChange={(e) => {
                      const paye = parseFloat(e.target.value);
                      setEditingOrder({
                        ...editingOrder,
                        montant_paye: paye,
                        montant_restant: editingOrder.prix_vente_cfa - paye
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Expédition</label>
                  <input
                    type="date"
                    value={editingOrder.date_expedition || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, date_expedition: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editingOrder.statut}
                    onChange={(e) => setEditingOrder({...editingOrder, statut: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuts.filter(s => s !== 'Tous').map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editingOrder.notes || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateOrder}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && orderToDelete && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirmer la suppression</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la commande de <strong>{orderToDelete.client}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteOrder}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingApp;
