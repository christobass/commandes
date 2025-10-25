import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Package, Clock, CheckCircle, Trash2, Edit, X, TrendingUp, Calendar, AlertCircle, LogOut, Users, Eye, EyeOff, Shield, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://pzailvvjosssdluuabaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YWlsdnZqb3Nzc2RsdXVhYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTMzNDIsImV4cCI6MjA3NjU2OTM0Mn0.5gfX3gevuD1Q7a9AhYB7i03Rp3e79s0HrrYowWy8Y38';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction simple de hashing (côté client - pour comparaison seulement)
// Note: Le vrai hashing bcrypt se fait côté serveur
const simpleHash = (password) => {
  return btoa(password); // Simple encodage base64 pour démonstration
};

// Composant de connexion
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
      // Récupérer l'utilisateur depuis Supabase
      const { data: users, error: fetchError } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .limit(1);

      if (fetchError) throw fetchError;

      if (!users || users.length === 0) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setLoading(false);
        return;
      }

      const user = users[0];

      // Vérification simple du mot de passe
      // Note: Dans une vraie application, utilisez bcrypt côté serveur
      const bcrypt = require('bcryptjs');
      const isValid = bcrypt.compareSync(password, user.password_hash);

      if (!isValid) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setLoading(false);
        return;
      }

      // Connexion réussie
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email
      };

      // Sauvegarder dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur lors de la connexion. Vérifiez votre connexion.');
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Comptes de test:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👨‍💼 Admin: <span className="font-mono bg-gray-100 px-2 py-1 rounded">christian</span> / <span className="font-mono bg-gray-100 px-2 py-1 rounded">bassole_9696</span></p>
              <p>👤 User: <span className="font-mono bg-gray-100 px-2 py-1 rounded">user01</span> / <span className="font-mono bg-gray-100 px-2 py-1 rounded">M@tDeP@ss</span></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant de gestion des utilisateurs (Admin uniquement)
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
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
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
      const bcrypt = require('bcryptjs');
      const passwordHash = bcrypt.hashSync(newUser.password, 10);

      const { error } = await supabase
        .from('app_users')
        .insert([{
          username: newUser.username,
          password_hash: passwordHash,
          role: newUser.role,
          full_name: newUser.full_name,
          email: newUser.email,
          is_active: true
        }]);

      if (error) throw error;

      alert('Utilisateur créé avec succès !');
      setNewUser({ username: '', password: '', role: 'user', full_name: '', email: '' });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur: ' + (error.message || 'Impossible de créer l\'utilisateur'));
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

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`)) {
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
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
                        {user.full_name && (
                          <p className="text-sm text-gray-500">{user.full_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                          title={user.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                            title="Supprimer"
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

// Composant principal de l'application
const OrderTrackingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
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
    dateExpedition: '',
    notes: ''
  });

  const statuts = ['Tous', 'Acompte en attente', 'Commandé', 'En transit', 'Arrivé', 'Livré'];

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Charger les commandes depuis Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date_commande', { ascending: false });

      if (error) throw error;

      const formattedOrders = data.map(order => ({
        id: order.id,
        dateCommande: order.date_commande,
        client: order.client,
        telephone: order.telephone,
        produit: order.produit,
        prixAchatYuan: order.prix_achat_yuan,
        tauxChange: order.taux_change,
        prixVenteCFA: order.prix_vente_cfa,
        acompte: order.acompte,
        solde: order.solde,
        montantPaye: order.montant_paye,
        montantRestant: order.montant_restant,
        dateAcompte: order.date_acompte,
        dateSolde: order.date_solde,
        dateExpedition: order.date_expedition,
        dateArriveePrevu: order.date_arrivee_prevu,
        dateArriveeEffective: order.date_arrivee_effective,
        statut: order.statut,
        notes: order.notes
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setOrders([]);
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

  const handleAddOrder = async () => {
    if (currentUser.role !== 'admin') {
      alert('Seuls les administrateurs peuvent ajouter des commandes');
      return;
    }

    if (!newOrder.client || !newOrder.telephone || !newOrder.produit || !newOrder.prixVenteCFA) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(newOrder.prixVenteCFA);
    const acompte = Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;

    const today = new Date().toISOString().split('T')[0];
    const arriveeDans28Jours = new Date();
    arriveeDans28Jours.setDate(arriveeDans28Jours.getDate() + 28);

    const { data: existingOrders } = await supabase
      .from('orders')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (existingOrders && existingOrders.length > 0) {
      const lastId = existingOrders[0].id;
      const lastNumber = parseInt(lastId.replace('CMD', ''));
      nextNumber = lastNumber + 1;
    }

    const order = {
      id: `CMD${String(nextNumber).padStart(3, '0')}`,
      date_commande: today,
      client: newOrder.client,
      telephone: newOrder.telephone,
      produit: newOrder.produit,
      prix_achat_yuan: parseFloat(newOrder.prixAchatYuan) || 0,
      taux_change: parseFloat(newOrder.tauxChange) || 85,
      prix_vente_cfa: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montant_paye: 0,
      montant_restant: prixVenteCFA,
      date_acompte: null,
      date_solde: null,
      date_expedition: newOrder.dateExpedition || null,
      date_arrivee_prevu: arriveeDans28Jours.toISOString().split('T')[0],
      date_arrivee_effective: null,
      statut: 'Acompte en attente',
      notes: newOrder.notes
    };

    try {
      const { error } = await supabase
        .from('orders')
        .insert([order]);

      if (error) throw error;

      await fetchOrders();
      
      setNewOrder({ client: '', telephone: '', produit: '', prixAchatYuan: '', tauxChange: 85, prixVenteCFA: '', dateExpedition: '', notes: '' });
      setShowAddForm(false);
      alert('Commande ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de la commande.');
    }
  };

  const handleDeleteClick = (order) => {
    if (currentUser.role !== 'admin') {
      alert('Seuls les administrateurs peuvent supprimer des commandes');
      return;
    }
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderToDelete.id);

      if (error) throw error;

      await fetchOrders();
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      alert('Commande supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la commande.');
    }
  };

  const handleEditClick = (order) => {
    if (currentUser.role !== 'admin') {
      alert('Seuls les administrateurs peuvent modifier des commandes');
      return;
    }
    setEditingOrder({...order});
    setShowEditForm(true);
  };

  const handleEditOrder = async () => {
    if (!editingOrder.client || !editingOrder.telephone || !editingOrder.produit || !editingOrder.prixVenteCFA) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(editingOrder.prixVenteCFA);
    const acompte = Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;
    const montantPaye = parseFloat(editingOrder.montantPaye) || 0;
    const montantRestant = prixVenteCFA - montantPaye;

    const updatedOrder = {
      client: editingOrder.client,
      telephone: editingOrder.telephone,
      produit: editingOrder.produit,
      prix_achat_yuan: parseFloat(editingOrder.prixAchatYuan) || 0,
      taux_change: parseFloat(editingOrder.tauxChange) || 85,
      prix_vente_cfa: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montant_paye: montantPaye,
      montant_restant: montantRestant,
      date_expedition: editingOrder.dateExpedition || null,
      date_arrivee_prevu: editingOrder.dateArriveePrevu,
      statut: editingOrder.statut,
      notes: editingOrder.notes
    };

    try {
      const { error } = await supabase
        .from('orders')
        .update(updatedOrder)
        .eq('id', editingOrder.id);

      if (error) throw error;

      await fetchOrders();
      setShowEditForm(false);
      setEditingOrder(null);
      alert('Commande mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la commande.');
    }
  };

  const handleStatutChange = async (orderId, newStatut) => {
    if (currentUser.role !== 'admin') {
      alert('Seuls les administrateurs peuvent changer le statut');
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updates = { statut: newStatut };
    const today = new Date().toISOString().split('T')[0];
    
    if (newStatut === 'Commandé' && !order.dateAcompte) {
      updates.date_acompte = today;
      updates.montant_paye = order.acompte;
      updates.montant_restant = order.solde;
    }
    
    if (newStatut === 'En transit' && !order.dateExpedition) {
      updates.date_expedition = today;
    }
    
    if (newStatut === 'Arrivé' && !order.dateArriveeEffective) {
      updates.date_arrivee_effective = today;
    }
    
    if (newStatut === 'Livré') {
      if (!order.dateArriveeEffective) {
        updates.date_arrivee_effective = today;
      }
      if (!order.dateSolde && order.montantRestant > 0) {
        updates.date_solde = today;
        updates.montant_paye = order.prixVenteCFA;
        updates.montant_restant = 0;
      }
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  // Si non connecté, afficher la page de connexion
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatut = filterStatut === 'Tous' || order.statut === filterStatut;
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.produit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatut && matchesSearch;
  });

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => o.statut !== 'Livré').length,
    livrees: orders.filter(o => o.statut === 'Livré').length,
    montantTotal: orders.reduce((sum, o) => sum + o.prixVenteCFA, 0),
    montantPaye: orders.reduce((sum, o) => sum + o.montantPaye, 0),
    montantRestant: orders.reduce((sum, o) => sum + o.montantRestant, 0)
  };

  const isAdmin = currentUser.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Package className="text-blue-600" size={40} />
                Suivi des Commandes
              </h1>
              <p className="text-gray-600">Système de gestion des commandes</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  {isAdmin ? <Shield className="text-purple-600" size={20} /> : <User className="text-blue-600" size={20} />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{currentUser.full_name || currentUser.username}</p>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Administrateur' : 'Utilisateur'}</p>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowUserManagement(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
                  title="Gérer les utilisateurs"
                >
                  <Users size={20} />
                  <span className="hidden md:inline">Utilisateurs</span>
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                title="Se déconnecter"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Mode consultation</p>
                <p className="text-blue-600 text-sm mt-1">Vous pouvez visualiser les commandes mais pas les modifier.</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Erreur</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-blue-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">En cours</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.enCours}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Livrées</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.livrees}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-blue-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Total ventes</p>
            </div>
            <p className="text-lg font-bold text-blue-900">{formatCFA(stats.montantTotal)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Payé</p>
            </div>
            <p className="text-lg font-bold text-green-900">{formatCFA(stats.montantPaye)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-orange-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Restant</p>
            </div>
            <p className="text-lg font-bold text-orange-900">{formatCFA(stats.montantRestant)}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par client, commande ou produit..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  <Plus size={20} />
                  <span className="hidden md:inline">Nouvelle commande</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Management Modal */}
        {showUserManagement && isAdmin && (
          <UserManagement 
            currentUser={currentUser}
            onClose={() => setShowUserManagement(false)}
          />
        )}

        {/* Add Order Modal */}
        {showAddForm && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Commande</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.client}
                      onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.telephone}
                      onChange={(e) => setNewOrder({...newOrder, telephone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.produit}
                    onChange={(e) => setNewOrder({...newOrder, produit: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix achat (¥)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.prixAchatYuan}
                      onChange={(e) => setNewOrder({...newOrder, prixAchatYuan: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taux de change</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.tauxChange}
                      onChange={(e) => setNewOrder({...newOrder, tauxChange: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix vente (FCFA) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.prixVenteCFA}
                      onChange={(e) => setNewOrder({...newOrder, prixVenteCFA: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expédition</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.dateExpedition}
                    onChange={(e) => setNewOrder({...newOrder, dateExpedition: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddOrder}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer la commande <strong>{orderToDelete?.id}</strong> ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Order Modal - Similar to Add Order but with edit functionality */}
        {showEditForm && editingOrder && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Modifier la Commande</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingOrder(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.client}
                      onChange={(e) => setEditingOrder({...editingOrder, client: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.telephone}
                      onChange={(e) => setEditingOrder({...editingOrder, telephone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.produit}
                    onChange={(e) => setEditingOrder({...editingOrder, produit: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix achat (¥)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.prixAchatYuan}
                      onChange={(e) => setEditingOrder({...editingOrder, prixAchatYuan: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taux de change</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.tauxChange}
                      onChange={(e) => setEditingOrder({...editingOrder, tauxChange: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix vente (FCFA) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.prixVenteCFA}
                      onChange={(e) => setEditingOrder({...editingOrder, prixVenteCFA: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.statut}
                    onChange={(e) => setEditingOrder({...editingOrder, statut: e.target.value})}
                  >
                    {statuts.filter(s => s !== 'Tous').map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expédition</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateExpedition || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateExpedition: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant payé (FCFA)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.montantPaye}
                    onChange={(e) => setEditingOrder({...editingOrder, montantPaye: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={editingOrder.notes}
                    onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleEditOrder}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingOrder(null);
                    }}
                    className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(order.statut)}`}>
                        {order.statut}
                      </span>
                      {order.montantRestant > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          Reste : {formatCFA(order.montantRestant)}
                        </span>
                      )}
                      {order.montantRestant === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                          ✓ Payé intégralement
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Commandé le {new Date(order.dateCommande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {isAdmin ? (
                      <>
                        <select
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={order.statut}
                          onChange={(e) => handleStatutChange(order.id, e.target.value)}
                        >
                          {statuts.filter(s => s !== 'Tous').map(statut => (
                            <option key={statut} value={statut}>{statut}</option>
                          ))}
                        </select>
                        
                        <button
                          onClick={() => handleEditClick(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                        {order.statut}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <Package size={16} />
                        Client & Produit
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700"><span className="font-medium">Nom:</span> {order.client}</p>
                        <p className="text-gray-700"><span className="font-medium">Tél:</span> {order.telephone}</p>
                        <p className="text-gray-700"><span className="font-medium">Produit:</span> {order.produit}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <TrendingUp size={16} />
                        Informations Prix
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700"><span className="font-medium">Prix achat:</span> {formatYuan(order.prixAchatYuan)}</p>
                        <p className="text-gray-700"><span className="font-medium">Taux:</span> {order.tauxChange} FCFA/¥</p>
                        <p className="text-gray-700"><span className="font-medium">Prix achat CFA:</span> <span className="font-bold text-blue-700">{formatCFA(Math.round(order.prixAchatYuan * order.tauxChange))}</span></p>
                        <p className="text-gray-700"><span className="font-medium">Prix vente:</span> <span className="font-bold text-blue-900">{formatCFA(order.prixVenteCFA)}</span></p>
                        <p className="text-gray-700"><span className="font-medium">Marge:</span> <span className="font-bold text-green-700">{formatCFA(order.prixVenteCFA - Math.round(order.prixAchatYuan * order.tauxChange))}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <DollarSign size={16} />
                        Paiements
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Acompte 70%</p>
                          <p className="font-bold text-green-900">{formatCFA(order.acompte)}</p>
                          {order.dateAcompte && (
                            <p className="text-xs text-green-700 mt-0.5">✓ {new Date(order.dateAcompte).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Solde 30%</p>
                          <p className="font-bold text-green-900">{formatCFA(order.solde)}</p>
                          {order.dateSolde && (
                            <p className="text-xs text-green-700 mt-0.5">✓ {new Date(order.dateSolde).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Montant payé</p>
                          <p className="font-bold text-blue-900">{formatCFA(order.montantPaye)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Montant restant</p>
                          <p className="font-bold text-orange-900">{formatCFA(order.montantRestant)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <Calendar size={16} />
                        Dates
                      </h4>
                      <div className="space-y-1 text-xs">
                        {order.dateExpedition && (
                          <p className="text-gray-700"><span className="font-medium">Expédition:</span> {new Date(order.dateExpedition).toLocaleDateString('fr-FR')}</p>
                        )}
                        <p className="text-gray-700"><span className="font-medium">Arrivée prévue:</span> {new Date(order.dateArriveePrevu).toLocaleDateString('fr-FR')}</p>
                        {order.dateArriveeEffective && (
                          <p className="text-gray-700"><span className="font-medium">Arrivée effective:</span> {new Date(order.dateArriveeEffective).toLocaleDateString('fr-FR')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {order.notes}</p>
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
    </div>
  );
};

export default OrderTrackingApp;
