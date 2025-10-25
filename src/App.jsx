import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Package, Clock, CheckCircle, Trash2, Edit, X, Calendar, User, Eye, EyeOff, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://pzailvvjosssdluuabaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YWlsdnZqb3Nzc2RsdXVhYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4ODY0OTQsImV4cCI6MjA0NTQ2MjQ5NH0.H9JDVBa7bBTUxCnXLc7w5EWqp7VdQo9hTOI4S1OVH6g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Composant Page de Connexion
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.rpc('verify_user_password', {
        p_username: username,
        p_password: password
      });

      if (error) throw error;

      if (!data || data.length === 0 || !data[0].is_valid) {
        setError('Identifiants incorrects');
        setLoading(false);
        return;
      }

      const userData = {
        id: data[0].user_id,
        username: data[0].username,
        role: data[0].role,
        full_name: data[0].full_name,
        email: data[0].email
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      setError('Erreur de connexion: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Gestion Commandes
            </h1>
            <p className="text-gray-600">Connectez-vous pour continuer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Compte de test: christian / bassole_9696</p>
        </div>
      </div>
    </div>
  );
};

// Composant Principal
const OrderTrackingApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
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
    dateExpedition: '',
    dateArriveePrevu: '',
    notes: ''
  });

  const statuts = ['Tous', 'Acompte en attente', 'Commandé', 'En transit', 'Arrivé', 'Livré'];

  // Vérifier si l'utilisateur est connecté au chargement
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
    return new Intl.NumberFormat('fr-FR').format(montant || 0) + ' FCFA';
  };

  const formatYuan = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant || 0) + ' ¥';
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

  const handleDeleteClick = (order) => {
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

      fetchOrders();
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder({...order});
    setShowEditForm(true);
  };

  const handleEditOrder = async () => {
    if (!editingOrder.client || !editingOrder.telephone || !editingOrder.produit || !editingOrder.prix_vente_cfa) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(editingOrder.prix_vente_cfa);
    const acompte = parseFloat(editingOrder.acompte) || Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;
    const montantPaye = parseFloat(editingOrder.montant_paye) || 0;
    const montantRestant = prixVenteCFA - montantPaye;

    const updateData = {
      ...editingOrder,
      prix_vente_cfa: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montant_paye: montantPaye,
      montant_restant: montantRestant
    };

    try {
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', editingOrder.id);

      if (error) throw error;

      fetchOrders();
      setShowEditForm(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Erreur modification:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleStatutChange = async (orderId, newStatut) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updates = { statut: newStatut };
    const today = new Date().toISOString().split('T')[0];

    if (newStatut === 'Commandé' && !order.date_acompte) {
      updates.date_acompte = today;
      updates.montant_paye = order.acompte;
      updates.montant_restant = order.solde;
    }

    if (newStatut === 'Arrivé' && !order.date_arrivee_effective) {
      updates.date_arrivee_effective = today;
    }

    if (newStatut === 'Livré') {
      if (!order.date_solde) {
        updates.date_solde = today;
      }
      if (!order.date_arrivee_effective) {
        updates.date_arrivee_effective = today;
      }
      updates.montant_paye = order.prix_vente_cfa;
      updates.montant_restant = 0;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
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
    
    return {
      total: filteredOrders.length,
      enCours: filteredOrders.filter(o => !['Livré'].includes(o.statut)).length,
      livrees: filteredOrders.filter(o => o.statut === 'Livré').length,
      chiffreAffaires: paye,
      aEncaisser: restant
    };
  };

  const stats = calculateStats();

  // Afficher la page de connexion si non connecté
  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Gestion des Commandes</h1>
            <p className="text-gray-600 text-sm md:text-base">Suivi des commandes d'ordinateurs portables</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.full_name || currentUser.username}</p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">En Cours</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.enCours}</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Livrées</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{stats.livrees}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 col-span-2 md:col-span-1">
            <div>
              <p className="text-xs text-gray-600 mb-1">CA Encaissé</p>
              <p className="text-base md:text-lg font-bold text-purple-600">{formatCFA(stats.chiffreAffaires)}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 col-span-2 md:col-span-1">
            <div>
              <p className="text-xs text-gray-600 mb-1">À Encaisser</p>
              <p className="text-base md:text-lg font-bold text-yellow-600">{formatCFA(stats.aEncaisser)}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  {statuts.map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={20} />
              Nouvelle Commande
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{order.client}</h3>
                    <p className="text-sm text-gray-600">{order.telephone}</p>
                  </div>
                  <select
                    value={order.statut}
                    onChange={(e) => handleStatutChange(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatutColor(order.statut)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {statuts.filter(s => s !== 'Tous').map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">{order.produit}</p>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix d'achat:</span>
                    <span className="font-semibold text-gray-900">{formatYuan(order.prix_achat_yuan)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de change:</span>
                    <span className="font-semibold text-gray-900">{order.taux_change} FCFA/¥</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Prix de vente:</span>
                    <span className="font-bold text-lg text-blue-600">{formatCFA(order.prix_vente_cfa)}</span>
                  </div>
                  <div className="flex justify-between bg-yellow-50 -mx-5 px-5 py-2">
                    <span className="text-gray-700 font-medium">Acompte (70%):</span>
                    <span className="font-bold text-yellow-700">{formatCFA(order.acompte)}</span>
                  </div>
                  <div className="flex justify-between bg-green-50 -mx-5 px-5 py-2">
                    <span className="text-gray-700 font-medium">Solde (30%):</span>
                    <span className="font-bold text-green-700">{formatCFA(order.solde)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Montant payé:</span>
                    <span className="font-semibold text-green-600">{formatCFA(order.montant_paye)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant restant:</span>
                    <span className="font-semibold text-red-600">{formatCFA(order.montant_restant)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Commande: {order.date_commande ? new Date(order.date_commande).toLocaleDateString('fr-FR') : '-'}</span>
                  </div>
                  {order.date_acompte && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      <span>Acompte: {new Date(order.date_acompte).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {order.date_expedition && (
                    <div className="flex items-center gap-2">
                      <Package size={14} />
                      <span>Expédition: {new Date(order.date_expedition).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {order.date_arrivee_prevu && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Arrivée prévue: {new Date(order.date_arrivee_prevu).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {order.date_arrivee_effective && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      <span>Arrivée effective: {new Date(order.date_arrivee_effective).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {order.date_solde && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      <span>Solde payé: {new Date(order.date_solde).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                    {order.notes}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(order)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500">Commencez par ajouter votre première commande</p>
          </div>
        )}
      </div>

      {/* Modal Ajout - Partie 1 */}
